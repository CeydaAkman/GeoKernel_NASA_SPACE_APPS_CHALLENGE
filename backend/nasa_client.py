import requests
import pandas as pd
import numpy as np

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
