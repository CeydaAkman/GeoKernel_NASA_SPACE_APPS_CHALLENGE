# GAP Kuru Tarım Ürün Eşikleri ve Pilot Koordinatlar

PILOT_LOCATIONS = {
    "kiziltepe": {"name": "Kızıltepe Kuru Tarım Havzası (Mardin)", "lat": 37.18, "lon": 40.58},
    "viransehir": {"name": "Viranşehir Kuru Tarım Havzası (Şanlıurfa)", "lat": 37.23, "lon": 39.76},
    "bismil": {"name": "Bismil Geçiş Kuşağı (Diyarbakır)", "lat": 37.84, "lon": 40.66},
}

CROP_THRESHOLDS = {
    "wheat": {
        "tr_name": "Makarnalık Buğday",
        "min_root_moisture": 0.45,   # Çimlenme için gereken minimum kök bölgesi nem oranı (0-1)
        "max_sowing_temp": 27.0,     # Ekim için maksimum gündüz sıcaklığı (°C)
        "spring_heat_limit": 32.0,   # Bahar başaklanma dönemi kritik sıcaklık sınırı (°C)
        "alternative": "Kuraklığa Dayanıklı Arpa veya Sertifikalı Kurakçıl Buğday (Sorgül/Artuklu)",
        "loss_prevented": "%32"
    },
    "lentil": {
        "tr_name": "Kırmızı Mercimek",
        "min_root_moisture": 0.44,
        "max_sowing_temp": 26.5,
        "spring_heat_limit": 30.0,   # Mercimek bahar sıcaklarına buğdaydan daha hassastır
        "alternative": "Erkenci Kurakçıl Arpa Rotasyonu",
        "loss_prevented": "%38"
    },
    "barley": {
        "tr_name": "Arpa",
        "min_root_moisture": 0.38,   # Daha düşük nemde çimlenebilir
        "max_sowing_temp": 28.5,
        "spring_heat_limit": 34.0,
        "alternative": "Mevcut Ürün Uygun (Kuraklığa Dayanıklı Tür)",
        "loss_prevented": "%18"
    }
}
