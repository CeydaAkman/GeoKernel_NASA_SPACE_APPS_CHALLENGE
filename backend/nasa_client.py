import requests
import pandas as pd
import numpy as np

<<<<<<< HEAD

NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"


def fetch_nasa_power_data(
    lat: float,
    lon: float,
    start: str = "20050101",
    end: str = "20261031",
) -> pd.DataFrame:
    """
    Seçilen koordinat için NASA POWER API'den gerçek meteoroloji ve
    toprak nemi verilerini çeker.
    """

    params = {
        "parameters": "PRECTOTCORR,T2M,T2M_MAX,GWETTOP,GWETROOT",
        "community": "AG",
        "longitude": float(lon),
        "latitude": float(lat),
        "start": start,
        "end": end,
        "format": "JSON",
    }

    response = requests.get(
        NASA_POWER_URL,
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    try:
        raw_params = data["properties"]["parameter"]
    except KeyError as error:
        raise ValueError("NASA POWER API beklenen veri formatını döndürmedi.") from error

    if not raw_params:
        raise ValueError("NASA POWER API bu koordinat için veri döndürmedi.")

    df = pd.DataFrame(raw_params)
    if df.empty:
        raise ValueError("NASA POWER API'den boş veri döndü.")

    df.index = pd.to_datetime(df.index, format="%Y%m%d", errors="coerce")
    df = df[~df.index.isna()].copy()
    df.sort_index(inplace=True)

    df.replace([-999.0, -999, -9999.0, -9999], np.nan, inplace=True)

    required_columns = [
        "PRECTOTCORR",
        "T2M",
        "T2M_MAX",
        "GWETTOP",
        "GWETROOT",
    ]

    for column in required_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    available_columns = [col for col in required_columns if col in df.columns]
    if not available_columns:
        raise ValueError("NASA POWER API gerekli parametreleri döndürmedi.")

    df.dropna(how="all", subset=available_columns, inplace=True)

    df["year"] = df.index.year
    df["month"] = df.index.month
    df["doy"] = df.index.dayofyear

    return df


def calculate_soil_condition(df: pd.DataFrame) -> dict:
    """
    NASA POWER verileri ve tarihsel klimatolojik normal kullanılarak
    tarla için toprak koşulu değerlendirilir.
    """

    if df is None or df.empty:
        return {
            "soil_fertility_change": None,
            "soil_condition_index": None,
            "soil_explanation": "NASA POWER API'den yeterli veri alınamadı.",
            "status": "veri_yok",
        }

    df = df.sort_index()
    latest_date = df.index.max()
    cutoff_date = latest_date - pd.Timedelta(days=90)
    recent_df = df.loc[df.index > cutoff_date].copy()

    def _compute_index(sub_df: pd.DataFrame):
        root_moisture = sub_df["GWETROOT"].mean() if "GWETROOT" in sub_df.columns else np.nan
        top_moisture = sub_df["GWETTOP"].mean() if "GWETTOP" in sub_df.columns else np.nan
        rainfall = sub_df["PRECTOTCORR"].mean() if "PRECTOTCORR" in sub_df.columns else np.nan
        temperature = sub_df["T2M"].mean() if "T2M" in sub_df.columns else np.nan

        scores = []
        if pd.notna(root_moisture):
            scores.append(float(np.clip(root_moisture * 100, 0, 100)))
        if pd.notna(top_moisture):
            scores.append(float(np.clip(top_moisture * 100, 0, 100)))
        if pd.notna(rainfall):
            scores.append(float(np.clip((rainfall / 5) * 100, 0, 100)))
        if pd.notna(temperature):
            if 10 <= temperature <= 30:
                temperature_score = 100.0
            elif 5 <= temperature < 10 or 30 < temperature <= 35:
                temperature_score = 70.0
            else:
                temperature_score = 40.0
            scores.append(temperature_score)

        metrics = {
            "average_root_zone_moisture": round(float(root_moisture), 3) if pd.notna(root_moisture) else None,
            "average_top_soil_moisture": round(float(top_moisture), 3) if pd.notna(top_moisture) else None,
            "average_daily_rainfall_mm": round(float(rainfall), 2) if pd.notna(rainfall) else None,
            "average_temperature_c": round(float(temperature), 2) if pd.notna(temperature) else None,
        }
        return (round(float(np.mean(scores)), 1) if scores else None), metrics

    soil_condition_index, nasa_metrics = _compute_index(recent_df)

    if soil_condition_index is None:
        return {
            "soil_fertility_change": None,
            "soil_condition_index": None,
            "soil_explanation": "NASA POWER API verileri kullanılarak toprak koşulu hesaplanamadı.",
            "status": "hesaplanamadi",
        }

    recent_doys = recent_df["doy"].unique()
    historical_df = df[(df.index <= cutoff_date) & (df["doy"].isin(recent_doys))]
    hist_index, _ = _compute_index(historical_df)

    soil_fertility_change = (
        round(soil_condition_index - hist_index, 1)
        if hist_index is not None
        else 0.0
    )

    if soil_condition_index >= 75:
        status = "iyi"
        explanation = "NASA POWER verilerine göre tarla için toprak nemi ve iklim koşulları genel olarak uygun durumdadır."
    elif soil_condition_index >= 50:
        status = "orta"
        explanation = "NASA POWER verilerine göre toprak nemi ve iklim koşulları orta seviyededir. Tarla koşullarının düzenli takip edilmesi önerilir."
    else:
        status = "düşük"
        explanation = "NASA POWER verilerine göre mevcut nem ve iklim koşulları üretim açısından sınırlayıcı olabilir."

    return {
        "soil_fertility_change": soil_fertility_change,
        "soil_condition_index": soil_condition_index,
        "soil_explanation": explanation,
        "status": status,
        "nasa_data": nasa_metrics,
    }


def get_soil_analysis(
    lat: float,
    lon: float,
    start: str = "20050101",
    end: str = "20261031",
) -> dict:
    df = fetch_nasa_power_data(lat=lat, lon=lon, start=start, end=end)
    return calculate_soil_condition(df)
=======
NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

def fetch_nasa_power_data(lat: float, lon: float, start: str = "20050101", end: str = "20261031") -> pd.DataFrame:
    """
    Seçilen koordinat için NASA POWER AG (Tarım) topluluğundan günlük iklim ve toprak nemi verisi çeker.
    """
    params = {
        "parameters": "PRECTOTCORR,T2M_MAX,T2M_MIN,GWETTOP,GWETROOT",
        "community": "AG",
        "longitude": lon,
        "latitude": lat,
        "start": start,
        "end": end,
        "format": "JSON"
    }
    
    response = requests.get(NASA_POWER_URL, params=params, timeout=30)
    response.raise_for_status()
    raw_params = response.json()["properties"]["parameter"]
    
    df = pd.DataFrame(raw_params)
    df.index = pd.to_datetime(df.index, format="%Y%m%d")
    
    # NASA POWER'ın eksik veriler için kullandığı -999 değerlerini temizle
    df.replace(-999.0, np.nan, inplace=True)
    df.dropna(inplace=True)
    
    df["year"] = df.index.year
    df["month"] = df.index.month
    df["doy"] = df.index.dayofyear
    return df

# Hızlı Test: Kızıltepe verisini çekip ilk 5 satırı görelim
if __name__ == "__main__":
    test_df = fetch_nasa_power_data(37.18, 40.58)
    print(f"Toplam çekilen gün sayısı: {len(test_df)}")
    print(test_df.tail())
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
