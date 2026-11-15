from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tuik_client import get_top_crops_by_city, get_crop_by_name, get_strategy_crops
import glob
import json
import math
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from analyzer import analyze_parcel, normalize_crop_key, build_impact_and_calendar, doy_to_tr_date
from thresholds import CROP_THRESHOLDS
from database import (
    init_db,
    register_user_db,
    login_user_db,
    get_fields_by_user_db,
    create_field_db,
    save_plan_db,
    get_field_plans_db,
)

init_db()

app = FastAPI(title="GeoKernel — Field Shift GAP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE_DIR = os.path.join(BASE_DIR, "cache")


class RegisterRequest(BaseModel):
    fullName: str
    farmName: str = ""
    city: str = "Şanlıurfa"
    identifier: str
    password: str


class LoginRequest(BaseModel):
    identifier: str
    password: str


class FieldCreateRequest(BaseModel):
    userId: int
    name: str
    city: str = ""
    district: str = ""
    lat: float
    lon: float
    crop: str = "Makarnalık Buğday"


@app.post("/api/auth/register")
def api_register(payload: RegisterRequest):
    if len(payload.password.strip()) < 4:
        raise HTTPException(status_code=400, detail="Şifre en az 4 karakter olmalıdır.")

    user, err = register_user_db(
        payload.fullName,
        payload.farmName,
        payload.city,
        payload.identifier,
        payload.password,
    )
    if err:
        raise HTTPException(status_code=400, detail=err)
    return user


@app.post("/api/auth/login")
def api_login(payload: LoginRequest):
    user = login_user_db(payload.identifier, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="E-posta/telefon veya şifre hatalı.")
    return user


@app.get("/api/fields/{user_id}")
def api_get_fields(user_id: int):
    return get_fields_by_user_db(user_id)


@app.post("/api/fields")
def api_create_field(payload: FieldCreateRequest):
    return create_field_db(
        payload.userId,
        payload.name,
        payload.city,
        payload.district,
        payload.lat,
        payload.lon,
        payload.crop,
    )


class PlanSaveRequest(BaseModel):
    userId: int
    fieldId: int
    crop: str
    operations: list
    statuses: dict
    rating: str
    feedback: str
    yieldValue: float
    yieldUnit: str = "kg/da"


@app.post("/api/plans")
def api_save_plan(payload: PlanSaveRequest):
    try:
        if not payload.feedback.strip():
            raise HTTPException(
                status_code=400,
                detail="Geri bildirim boş olamaz."
            )

        if not payload.rating:
            raise HTTPException(
                status_code=400,
                detail="Değerlendirme seçilmelidir."
            )

        if payload.yieldValue < 0:
            raise HTTPException(
                status_code=400,
                detail="Verim negatif olamaz."
            )

        if len(payload.operations) != len(payload.statuses):
            raise HTTPException(
                status_code=400,
                detail="Bütün plan işlemleri değerlendirilmelidir."
            )

        for index in range(len(payload.operations)):
            if str(index) not in payload.statuses:
                raise HTTPException(
                    status_code=400,
                    detail="Bütün işlemler için durum seçilmelidir."
                )

            if payload.statuses[str(index)] not in (
                "applied",
                "not_applied"
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Geçersiz işlem durumu."
                )

        plan_id = save_plan_db(
            user_id=payload.userId,
            field_id=payload.fieldId,
            crop=payload.crop,
            operations=payload.operations,
            statuses=payload.statuses,
            rating=payload.rating,
            feedback=payload.feedback,
            yield_value=payload.yieldValue,
            yield_unit=payload.yieldUnit,
        )

        return {
            "success": True,
            "message": "Plan başarıyla kaydedildi.",
            "planId": plan_id,
        }

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@app.get("/api/fields/{field_id}/plans/{user_id}")
def api_get_field_plans(field_id: int, user_id: int):
    return get_field_plans_db(user_id, field_id)


def attach_impact_if_missing(data: dict, crop_key: str) -> dict:
    """Eski cache dosyalarında impact_metrics yoksa grafikteki nem ve risk skorundan otomatik üretir."""
    if "impact_metrics" not in data or not data["impact_metrics"]:
        chart = data.get("chart_data", [])
        recent_m = chart[-1]["root_moisture"] if chart else 0.52
        rec_win = data.get("sowing_window", {}).get("recommended", "1 Kasım - 11 Kasım")
        risk = int(data.get("risk_score", 30))
        data["impact_metrics"] = build_impact_and_calendar(crop_key, float(recent_m), risk, rec_win)
    return data


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def load_all_cached_results() -> list:
    items = []
    for path in glob.glob(os.path.join(CACHE_DIR, "*.json")):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict) and "location" in data and "sowing_window" in data:
                items.append(data)
        except Exception:
            continue
    return items


def interpolate_fallback_from_cache(lat: float, lon: float, crop_key: str, display_name: str) -> dict:
    cached_list = load_all_cached_results()
    rules = CROP_THRESHOLDS.get(crop_key, CROP_THRESHOLDS["wheat"])

    if not cached_list:
        res = {
            "location": {"name": display_name, "lat": lat, "lon": lon},
            "risk_score": 45,
            "climate_analogue": "Son 3 yıllık iklim profiliniz, 110 km güneydeki kurak tarım kuşağının geçmiş normalleriyle %84 eşleşti.",
            "sowing_window": {"traditional": "15 Ekim - 25 Ekim", "recommended": "1 Kasım - 11 Kasım", "shift_days": "+17 gün"},
            "crop_advice": {
                "current_crop": rules["tr_name"],
                "status": "Orta Risk — Kontrollü Üretim Uygun",
                "recommended_crop": f"{rules['tr_name']} (Mevcut Ürün Sürdürülebilir)",
                "expected_loss_prevented": f"{rules['loss_prevented']} rekolte kaybı önlenir",
            },
            "farmer_sms": f"UYARI ({display_name}): 15 Ekim'de ekim yapmayın; 1 Kasım - 11 Kasım aralığını bekleyin.",
            "chart_data": [],
        }
        return attach_impact_if_missing(res, crop_key)

    enriched = [(haversine_km(lat, lon, float(it["location"]["lat"]), float(it["location"]["lon"])), it) for it in cached_list]
    enriched.sort(key=lambda x: x[0])
    nearest_dist, nearest_item = enriched[0]

    if nearest_dist < 5.0:
        result = json.loads(json.dumps(nearest_item))
        if display_name:
            result["location"]["name"] = display_name
    else:
        weights = [1.0 / ((d + 1.0) ** 1.5) for d, _ in enriched]
        total_w = sum(weights)
        avg_risk = sum(item["risk_score"] * w for (_, item), w in zip(enriched, weights)) / total_w

        base_chart = nearest_item.get("chart_data", [])
        blended_chart = []
        for idx, row in enumerate(base_chart):
            r_mm = sum(
                (item["chart_data"][idx]["rainfall_mm"] if idx < len(item.get("chart_data", [])) else row["rainfall_mm"]) * w
                for (_, item), w in zip(enriched, weights)
            ) / total_w
            r_moist = sum(
                (item["chart_data"][idx]["root_moisture"] if idx < len(item.get("chart_data", [])) else row["root_moisture"]) * w
                for (_, item), w in zip(enriched, weights)
            ) / total_w
            blended_chart.append({"year": row["year"], "rainfall_mm": round(r_mm, 1), "root_moisture": round(r_moist, 2)})

        best_doy = 298
        rec_window = f"{doy_to_tr_date(best_doy)} - {doy_to_tr_date(best_doy + 10)}"

        result = {
            "location": {"name": display_name or f"GAP Parseli ({lat:.2f}, {lon:.2f})", "lat": lat, "lon": lon},
            "risk_score": int(round(avg_risk)),
            "climate_analogue": nearest_item["climate_analogue"],
            "sowing_window": {"traditional": "15 Ekim - 25 Ekim", "recommended": rec_window, "shift_days": "+10 gün"},
            "crop_advice": dict(nearest_item["crop_advice"]),
            "farmer_sms": nearest_item["farmer_sms"],
            "chart_data": blended_chart,
        }

    crop_offset = {"barley": -6, "wheat": 0, "lentil": 7}.get(crop_key, 0)
    adjusted_risk = max(15, min(98, int(result["risk_score"] + crop_offset)))
    needs_shift = adjusted_risk >= 65
    rec_crop = rules["alternative"] if needs_shift else f"{rules['tr_name']} (Mevcut Ürün Sürdürülebilir)"

    result["risk_score"] = adjusted_risk
    result["crop_advice"] = {
        "current_crop": rules["tr_name"],
        "status": "Yüksek Kuraklık ve Sıcak Stresi Riski" if needs_shift else "Düşük Risk — İklim Koşulları Uygun",
        "recommended_crop": rec_crop,
        "expected_loss_prevented": f"{rules['loss_prevented']} rekolte kaybı önlenir",
    }
    return attach_impact_if_missing(result, crop_key)


@app.get("/api/analyze")
def get_field_analysis(
    lat: float = 37.23,
    lon: float = 39.76,
    crop: str = "Makarnalık Buğday",
    name: str = "",
):
    crop_key = normalize_crop_key(crop)
    lat_r = round(lat, 2)
    lon_r = round(lon, 2)

    for path in glob.glob(os.path.join(CACHE_DIR, f"*{lat_r}_{lon_r}*.json")):
        fname = os.path.basename(path).lower()
        is_pilot_wheat = crop_key == "wheat" and not any(k in fname for k in ("_lentil", "_barley"))
        is_exact_crop = f"_{crop_key}" in fname
        if is_pilot_wheat or is_exact_crop:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    cached_data = json.load(f)
                if name:
                    cached_data["location"]["name"] = name
                return attach_impact_if_missing(cached_data, crop_key)
            except Exception:
                pass

    try:
        result = analyze_parcel(lat_r, lon_r, crop=crop_key, location_name=name or None)
        os.makedirs(CACHE_DIR, exist_ok=True)
        cache_path = os.path.join(CACHE_DIR, f"parcel_{lat_r}_{lon_r}_{crop_key}.json")
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        return result
    except Exception:
        return interpolate_fallback_from_cache(lat_r, lon_r, crop_key, name)





@app.get("/api/strategy")
def api_strategy(
    city: str = Query(..., min_length=1),
    crop: str = "",
):
    try:
        return get_strategy_crops(city=city, selected_crop=crop or None, limit=3)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Ekim stratejisi ürünleri alınamadı: {str(error)}"
        )


@app.get("/api/crops/profile")
def api_crop_profile(crop: str = Query(..., min_length=1)):
    item = get_crop_by_name(crop)
    if not item:
        raise HTTPException(status_code=404, detail="Seçilen ürün referans veri setinde bulunamadı.")
    return item

@app.get("/api/crops/top-by-city")
def api_top_crops_by_city(city: str = Query(..., min_length=1)):
    try:
        return get_top_crops_by_city(city)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Şehir ürün verileri alınamadı: {str(error)}"
        )


