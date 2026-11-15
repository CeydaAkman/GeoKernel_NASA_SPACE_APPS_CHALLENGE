import json
import os
import re
import unicodedata
from typing import Any

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data", "crop_data.json")


def _norm(value: str | None) -> str:
    value = value or ""
    value = value.replace("İ", "I").replace("ı", "i")
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return value.casefold().strip()


def load_crop_data() -> dict[str, Any]:
    if not os.path.exists(DATA_FILE):
        raise RuntimeError(f"crop_data.json bulunamadı: {DATA_FILE}")
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
    if not isinstance(data, dict) or not isinstance(data.get("products"), list):
        raise RuntimeError("crop_data.json içinde geçerli products listesi yok.")
    return data


def _city_matches(city: str, text: str | None) -> bool:
    if not city or not text:
        return False
    city_n = _norm(city)
    text_n = _norm(text)
    parts = re.split(r"[,;/|()]", text_n)
    return any(city_n == part.strip() for part in parts) or city_n in text_n


def get_crop_by_name(crop_name: str) -> dict | None:
    crop_n = _norm(crop_name)
    products = load_crop_data()["products"]

    for crop in products:
        if _norm(crop.get("name", "")) == crop_n:
            return crop

    # Varyant/uzun isim eşleştirmesi
    for crop in products:
        name_n = _norm(crop.get("name", ""))
        if crop_n and (crop_n in name_n or name_n in crop_n):
            return crop

    return None


def _matches_city(crop: dict, city: str) -> bool:
    if _city_matches(city, crop.get("provincesText")):
        return True
    if _city_matches(city, crop.get("regionProvinceText")):
        return True
    for match in crop.get("regionalMatches") or []:
        if _city_matches(city, match.get("provincesText")):
            return True
    return False


def get_crops_by_city(city: str, limit: int = 12) -> dict:
    if not city or not city.strip():
        raise RuntimeError("Şehir adı boş olamaz.")

    city = city.strip()
    data = load_crop_data()
    direct = []

    for crop in data["products"]:
        if _matches_city(crop, city):
            item = dict(crop)
            matches = []
            if _city_matches(city, crop.get("provincesText")) or _city_matches(city, crop.get("regionProvinceText")):
                matches.append({
                    "type": "main",
                    "region": crop.get("regionsText"),
                    "position": crop.get("productionStatus"),
                })
            for match in crop.get("regionalMatches") or []:
                if _city_matches(city, match.get("provincesText")):
                    matches.append({
                        "type": "regional",
                        "region": match.get("region"),
                        "position": match.get("productionPosition"),
                    })
            item["cityMatches"] = matches
            direct.append(item)

    candidates = direct or list(data["products"])
    candidates.sort(key=lambda c: (c.get("production2025Ton") or 0), reverse=True)

    return {
        "city": city,
        "source": data.get("datasetName"),
        "sourceYears": data.get("sourceYears"),
        "citySpecific": bool(direct),
        "description": data.get("description"),
        "crops": [serialize_crop(c) for c in candidates[:limit]],
    }


def serialize_crop(crop: dict) -> dict:
    return {
        "name": crop.get("name"),
        "category": crop.get("category"),
        "production2024Ton": crop.get("production2024Ton"),
        "production2025Ton": crop.get("production2025Ton"),
        "changePercentage": crop.get("changePercentage"),
        "plantingPeriod": crop.get("plantingPeriod"),
        "advantages": crop.get("advantages"),
        "risks": crop.get("risks"),
        "regionsText": crop.get("regionsText"),
        "provincesText": crop.get("provincesText"),
        "regionProvinceText": crop.get("regionProvinceText"),
        "productionStatus": crop.get("productionStatus"),
        "regionalMatches": crop.get("regionalMatches") or [],
        "cityMatches": crop.get("cityMatches", []),
    }


def _preferred_strategy_candidates(crops: list[dict]) -> list[dict]:
    """Önce Excel'de bulunan ve uygulamanın analiz profiline anlamlı eşleşen ürünleri seçer."""
    def score(c: dict) -> tuple[int, float]:
        name = _norm(c.get("name"))
        supported = 0 if ("bugday" in name or "wheat" in name or "arpa" in name or "barley" in name or "mercimek" in name or "lentil" in name) else 1
        return (supported, -(c.get("production2025Ton") or 0))

    return sorted(crops, key=score)


def get_strategy_crops(city: str, selected_crop: str | None = None, limit: int = 3) -> dict:
    """
    StrategyPage için sadece Excel -> crop_data.json kaynağından ürün seçer.
    İlk kart mümkünse kullanıcının seçtiği üründür; diğerleri seçilen şehirle
    Excel'de ilişkilendirilmiş alternatif ürünlerdir.
    """
    data = load_crop_data()
    products = data["products"]
    result: list[dict] = []
    used: set[str] = set()

    if selected_crop:
        selected = get_crop_by_name(selected_crop)
        if selected:
            item = dict(selected)
            item["isSelectedCrop"] = True
            result.append(item)
            used.add(_norm(item.get("name")))

    city_crops = [c for c in products if city and _matches_city(c, city)]
    for crop in _preferred_strategy_candidates(city_crops):
        key = _norm(crop.get("name"))
        if not key or key in used:
            continue
        item = dict(crop)
        item["isSelectedCrop"] = False
        result.append(item)
        used.add(key)
        if len(result) >= limit:
            break

    # Excel'de şehir eşleşmesi azsa yine sadece JSON'daki ulusal referans ürünleri kullan.
    if len(result) < limit:
        for crop in _preferred_strategy_candidates(products):
            key = _norm(crop.get("name"))
            if not key or key in used:
                continue
            item = dict(crop)
            item["isSelectedCrop"] = False
            result.append(item)
            used.add(key)
            if len(result) >= limit:
                break

    return {
        "city": city,
        "selectedCrop": selected_crop,
        "source": data.get("datasetName"),
        "sourceYears": data.get("sourceYears"),
        "strategies": [serialize_crop(c) | {"isSelectedCrop": bool(c.get("isSelectedCrop"))} for c in result[:limit]],
    }


def get_top_crops_by_city(city: str) -> dict:
    return get_crops_by_city(city, limit=12)
