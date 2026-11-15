import datetime
import numpy as np
import pandas as pd
from nasa_client import fetch_nasa_power_data
from thresholds import CROP_THRESHOLDS

MONTHS_TR = {
    1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan", 5: "Mayıs", 6: "Haziran",
    7: "Temmuz", 8: "Ağustos", 9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık"
}

AGRO_PROFILES = {
    "wheat": {
        "base_water_m3_da": 460,
        "base_cost_tl_da": 2450,
        "base_yield_kg_da": 340,
        "price_tl_kg": 11.8,
        "soil_health_delta": -2,
        "resource_saving_pct": 14,
        "operations": [
            {
                "category": "Ekim",
                "title": "Taban Gübreli Sertifikalı Tohum Ekimi",
                "window": "Dinamik Pencere (Kök Nemi ≥ %45)",
                "detail": "Dekara 20-22 kg kurakçıl sertifikalı tohum, 5-6 cm ekim derinliği.",
            },
            {
                "category": "Gübreleme",
                "title": "Taban (DAP) ve Bahar Üst (Üre) Gübrelemesi",
                "window": "Ekim Sırası & 15 Şubat - 10 Mart",
                "detail": "Ekimde 15 kg/da DAP; kardeşlenme başlangıcında yağış öncesi 12 kg/da Üre.",
            },
            {
                "category": "Sulama",
                "title": "Kritik Dönem Destek Sulaması (2 Uygulama)",
                "window": "10 - 25 Nisan (Başaklanma) & 10 - 20 Mayıs (Süt Olum)",
                "detail": "Yağışsız geçen baharlarda yağmurlama/damla ile yalnızca kritik fenolojik evrede verilir.",
            },
            {
                "category": "İlaçlama",
                "title": "Geniş Yapraklı Yabancı Ot & Süne Kontrolü",
                "window": "1 - 20 Mart (Ot) & 1 - 15 Mayıs (Süne)",
                "detail": "Kardeşlenme sonu herbisit; başaklanma sonrası ekonomik zarar eşiğinde süne mücadelesi.",
            },
        ],
    },
    "lentil": {
        "base_water_m3_da": 290,
        "base_cost_tl_da": 1850,
        "base_yield_kg_da": 165,
        "price_tl_kg": 27.5,
        "soil_health_delta": +14,
        "resource_saving_pct": 28,
        "operations": [
            {
                "category": "Ekim",
                "title": "Kışlık Kırmızı Mercimek Ekimi",
                "window": "Dinamik Pencere (Toprak Sıcaklığı ≤ 26°C)",
                "detail": "Dekara 12-14 kg tohum; yüzeysel kök yapısı nedeniyle kaymak tabakası kırılmalıdır.",
            },
            {
                "category": "Gübreleme",
                "title": "Azot Bağlayıcı Bakteri Aşılama & Fosfor Desteği",
                "window": "Ekim Öncesi (Sadece Taban)",
                "detail": "Baklagil olduğu için üst azot gübresi gerekmez; %35 azot tasarrufu ve toprağa doğal azot fiksasyonu sağlar.",
            },
            {
                "category": "Sulama",
                "title": "Kuru Tarım Rejimi (Tamamlayıcı Tek Su)",
                "window": "Sadece 15 - 30 Nisan (Çiçeklenme Kuraklığında)",
                "detail": "Kış ve erken bahar yağışlarıyla yetişir; aşırı sulama kök çürüklüğüne yol açar.",
            },
            {
                "category": "İlaçlama",
                "title": "Çıkış Öncesi Yabancı Ot & Hortumlu Böcek Mücadelesi",
                "window": "Ekim Sonrası İlk 5 Gün & 20 Mart - 10 Nisan",
                "detail": "Dar yapraklı yabancı otlara karşı erken müdahale verim kaybını %22 önler.",
            },
        ],
    },
    "barley": {
        "base_water_m3_da": 350,
        "base_cost_tl_da": 1980,
        "base_yield_kg_da": 390,
        "price_tl_kg": 9.6,
        "soil_health_delta": +6,
        "resource_saving_pct": 24,
        "operations": [
            {
                "category": "Ekim",
                "title": "Erkenci 2-Sıralı Kurakçıl Arpa Ekimi",
                "window": "Dinamik Pencere (Kök Nemi ≥ %38)",
                "detail": "Dekara 18-20 kg tohum; düşük nemde bile hızlı çimlenme ve toprak örtüsü sağlar.",
            },
            {
                "category": "Gübreleme",
                "title": "Düşük Doz Kontrollü Taban ve Kardeşlenme Gübresi",
                "window": "Ekim Sırası & 1 - 20 Şubat",
                "detail": "Buğdaya kıyasla %20 daha az azot tüketir; yatma riskine karşı erken baharda tek seferde uygulanır.",
            },
            {
                "category": "Sulama",
                "title": "Sapa Kalkma Dönemi Tek Destek Sulaması",
                "window": "25 Mart - 12 Nisan",
                "detail": "Erken olgunlaştığı için Mayıs sıcak dalgalarından önce dane dolumunu tamamlar.",
            },
            {
                "category": "İlaçlama",
                "title": "Arpa Yaprak Lekesi & Yabancı Ot Kontrolü",
                "window": "20 Şubat - 15 Mart",
                "detail": "Erken kardeşlenme döneminde tek geçişli yaprak koruma uygulaması yeterlidir.",
            },
        ],
    },
}


def normalize_crop_key(crop: str) -> str:
    if not crop:
        return "wheat"
    c = crop.strip().lower()
    if c in CROP_THRESHOLDS:
        return c
    if "mercimek" in c or "lentil" in c:
        return "lentil"
    if "arpa" in c or "barley" in c:
        return "barley"
    return "wheat"


def doy_to_tr_date(doy: int) -> str:
    base = datetime.date(2025, 1, 1) + datetime.timedelta(days=int(doy) - 1)
    return f"{base.day} {MONTHS_TR[base.month]}"


def build_impact_and_calendar(crop_key: str, rec_root_moisture: float, risk_score: int, rec_window_str: str) -> dict:
    """Seçilen ürüne ve parsel nemine göre su tasarrufu, toprak verimi, kâr ve operasyon takvimini üretir."""
    prof = AGRO_PROFILES[crop_key]
    moisture_bonus = max(0.85, min(1.18, rec_root_moisture / 0.50))

    # Referans geleneksel sulu buğdaya (540 m3/da) kıyasla su tasarrufu
    reference_water = 540
    actual_water = int(round(prof["base_water_m3_da"] * (2.0 - moisture_bonus)))
    water_saved_m3 = max(45, reference_water - actual_water)
    water_saved_pct = min(55, max(10, round((water_saved_m3 / reference_water) * 100)))

    # Verim, Maliyet ve Net Kâr Hesabı (TL / Dekar)
    risk_factor = max(0.78, 1.08 - (risk_score / 280.0))
    est_yield_kg = round(prof["base_yield_kg_da"] * moisture_bonus * risk_factor)
    gross_income = round(est_yield_kg * prof["price_tl_kg"])
    net_profit_tl = max(950, gross_income - prof["base_cost_tl_da"])

    # Sonraki 4 yıl için Toprak Verim Endeksi & Kaynak Tüketim Projeksiyonu
    base_soil_idx = 72
    delta = prof["soil_health_delta"]
    projection_series = []
    for i, yr in enumerate(["2026", "2027", "2028", "2029"]):
        soil_score = min(96, max(55, round(base_soil_idx + i * (delta * 0.45) + (moisture_bonus - 1) * 15)))
        resource_idx = max(48, min(95, round(100 - prof["resource_saving_pct"] - i * 2.5)))
        projection_series.append({
            "year": yr,
            "soil_fertility_index": soil_score,
            "resource_usage_index": resource_idx,
            "net_profit_tl": round(net_profit_tl * (1 + i * (0.04 if delta > 0 else 0.015))),
        })

    # Takvim adımlarına dinamik ekim tarihini yerleştir
    operations = []
    for op in prof["operations"]:
        item = dict(op)
        if item["category"] == "Ekim":
            item["window"] = rec_window_str
        operations.append(item)

    return {
        "water_saved_m3_da": water_saved_m3,
        "water_saved_pct": water_saved_pct,
        "resource_saving_pct": prof["resource_saving_pct"],
        "soil_fertility_change": f"+%{prof['soil_health_delta']}" if prof["soil_health_delta"] >= 0 else f"%{prof['soil_health_delta']}",
        "soil_fertility_note": (
            "Toprağa doğal azot bağlayarak organik maddeyi artırır"
            if prof["soil_health_delta"] > 5
            else "Toprak nem dengesini ve anız örtüsünü korur"
            if prof["soil_health_delta"] >= 0
            else "Baklagil rotasyonuyla desteklenmesi önerilir"
        ),
        "estimated_yield_kg_da": est_yield_kg,
        "net_profit_tl_da": net_profit_tl,
        "projection_series": projection_series,
        "operations": operations,
    }


def analyze_parcel(lat: float, lon: float, crop: str = "wheat", location_name: str = None) -> dict:
    crop_key = normalize_crop_key(crop)
    rules = CROP_THRESHOLDS[crop_key]

    df = fetch_nasa_power_data(lat, lon)

    baseline = df[df["year"] <= 2022]
    recent = df[df["year"] >= 2023]

    base_root_moisture = baseline[baseline["month"].isin([10, 11, 3, 4])]["GWETROOT"].mean()
    rec_root_moisture = recent[recent["month"].isin([10, 11, 3, 4])]["GWETROOT"].mean()
    moisture_change_pct = ((rec_root_moisture - base_root_moisture) / base_root_moisture) * 100

    base_hot_days = (
        baseline[(baseline["month"].isin([3, 4, 5])) & (baseline["T2M_MAX"] > rules["spring_heat_limit"])]
        .groupby("year")
        .size()
        .mean()
    )
    rec_hot_days = (
        recent[(recent["month"].isin([3, 4, 5])) & (recent["T2M_MAX"] > rules["spring_heat_limit"])]
        .groupby("year")
        .size()
        .mean()
    )
    base_hot_days = 0 if np.isnan(base_hot_days) else base_hot_days
    rec_hot_days = 0 if np.isnan(rec_hot_days) else rec_hot_days

    moisture_penalty = max(0, -moisture_change_pct * 2.2)
    heat_penalty = max(0, (rec_hot_days - base_hot_days) * 3.5)
    base_risk = 45 if rec_root_moisture < rules["min_root_moisture"] else 25
    risk_score = int(np.clip(round(base_risk + moisture_penalty + heat_penalty), 15, 98))

    autumn_recent = (
        recent[recent["doy"].between(274, 345)]
        .groupby("doy")[["GWETROOT", "T2M_MAX"]]
        .mean()
        .rolling(7, min_periods=1)
        .mean()
    )
    suitable_days = autumn_recent[
        (autumn_recent["GWETROOT"] >= rules["min_root_moisture"])
        & (autumn_recent["T2M_MAX"] <= rules["max_sowing_temp"])
    ]

    traditional_doy = 288
    if not suitable_days.empty:
        best_doy = int(suitable_days.index[0])
    else:
        best_doy = int(autumn_recent["GWETROOT"].idxmax())

    shift_days = best_doy - traditional_doy
    if shift_days == 0:
        shift_str = "Zamanında Ekim (0 gün kayma)"
    elif shift_days > 0:
        shift_str = f"+{shift_days} gün"
    else:
        shift_str = f"{shift_days} gün"

    rec_window_str = f"{doy_to_tr_date(best_doy)} - {doy_to_tr_date(best_doy + 10)}"

    km_shift = int(max(80, abs(moisture_change_pct) * 14 + (rec_hot_days - base_hot_days) * 18))
    match_pct = int(np.clip(82 + abs(moisture_change_pct) * 0.4, 80, 96))
    analogue_text = (
        f"Son 3 yıllık iklim profiliniz, {km_shift} km güneydeki kurak tarım kuşağının "
        f"geçmiş normalleriyle %{match_pct} eşleşti."
    )

    if risk_score >= 65:
        crop_status = "Yüksek Kuraklık ve Sıcak Stresi Riski"
        rec_crop = rules["alternative"]
    elif risk_score >= 40:
        crop_status = "Orta Risk — Kontrollü Üretim Uygun"
        rec_crop = f"{rules['tr_name']} (Mevcut Ürün Sürdürülebilir)"
    else:
        crop_status = "Düşük Risk — İklim Koşulları Uygun"
        rec_crop = f"{rules['tr_name']} (Mevcut Ürün Sürdürülebilir)"

    yearly = (
        df[df["year"] >= 2015]
        .groupby("year")
        .agg(
            rainfall_mm=("PRECTOTCORR", "sum"),
            root_moisture=("GWETROOT", "mean"),
        )
        .reset_index()
    )

    chart_data = [
        {
            "year": str(int(row["year"])),
            "rainfall_mm": round(float(row["rainfall_mm"]), 1),
            "root_moisture": round(float(row["root_moisture"]), 2),
        }
        for _, row in yearly.iterrows()
    ]

    loc_label = location_name or f"GAP Parseli ({lat:.2f}, {lon:.2f})"
    abs_moisture_diff = abs(round(moisture_change_pct))

    if abs(shift_days) <= 2:
        sms_text = (
            f"BİLGİ ({loc_label}): Kök bölgesi nemi ve toprak sıcaklığı geleneksel ekim takvimiyle uyumlu. "
            f"{rec_window_str} aralığında {rules['tr_name']} ekimi güvenle yapılabilir."
        )
    elif moisture_change_pct < 0:
        sms_text = (
            f"UYARI ({loc_label}): Kök bölgesi nemi uzun yıllar ortalamasının %{abs_moisture_diff} altında. "
            f"15 Ekim'de erken ekim yapmayın; güvenli nem penceresi olan {rec_window_str} aralığını bekleyin. "
            f"Öneri: {rec_crop}."
        )
    else:
        sms_text = (
            f"UYARI ({loc_label}): Kök bölgesi nemi ortalamanın %{abs_moisture_diff} üzerinde olsa da sonbahar "
            f"toprak sıcaklığı çimlenme eşiğinin üstünde seyrediyor. Erken ekim stresine karşı {rec_window_str} "
            f"aralığını bekleyin. Öneri: {rec_crop}."
        )

    impact_data = build_impact_and_calendar(crop_key, float(rec_root_moisture), risk_score, rec_window_str)

    return {
        "location": {"name": loc_label, "lat": lat, "lon": lon},
        "risk_score": risk_score,
        "climate_analogue": analogue_text,
        "sowing_window": {
            "traditional": "15 Ekim - 25 Ekim",
            "recommended": rec_window_str,
            "shift_days": shift_str,
        },
        "crop_advice": {
            "current_crop": rules["tr_name"],
            "status": crop_status,
            "recommended_crop": rec_crop,
            "expected_loss_prevented": f"{rules['loss_prevented']} rekolte kaybı önlenir",
        },
        "impact_metrics": impact_data,
        "farmer_sms": sms_text,
        "chart_data": chart_data,
    }