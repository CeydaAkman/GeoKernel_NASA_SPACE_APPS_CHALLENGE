import axios from "axios";
import { useEffect, useState } from "react";

<<<<<<< HEAD
const OPENWEATHER_KEY = 
=======
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522

function mapOwmIcon(iconCode) {
  if (!iconCode) return "⛅";
  if (iconCode.startsWith("01")) return "☀️";
  if (iconCode.startsWith("02")) return "⛅";
  if (iconCode.startsWith("03") || iconCode.startsWith("04")) return "☁️";
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) return "🌧️";
  if (iconCode.startsWith("11")) return "⛈️";
  if (iconCode.startsWith("13")) return "❄️";
  return "🌫️";
}

function formatDateTr(dtTxt) {
  if (!dtTxt) return "";
  const dateObj = new Date(dtTxt);
  return dateObj.toLocaleDateString("tr-TR", { day: "numeric", month: "short", weekday: "short" });
}

export default function WeatherCard({ field }) {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!field?.lat || !field?.lon) return;
    let active = true;
    setLoading(true);

    const lat = field.lat;
    const lon = field.lon;

    Promise.all([
      axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { lat, lon, appid: OPENWEATHER_KEY, units: "metric", lang: "tr" },
        timeout: 5000,
      }),
      axios.get("https://api.openweathermap.org/data/2.5/forecast", {
        params: { lat, lon, appid: OPENWEATHER_KEY, units: "metric", lang: "tr" },
        timeout: 5000,
      }),
    ])
      .then(([currRes, foreRes]) => {
        if (!active) return;
        const curData = currRes.data;
        setCurrent({
          temp: Math.round(curData.main.temp),
          desc: curData.weather?.[0]?.description
            ? curData.weather[0].description.charAt(0).toUpperCase() + curData.weather[0].description.slice(1)
            : "",
          icon: mapOwmIcon(curData.weather?.[0]?.icon),
          humidity: curData.main.humidity,
          wind: Math.round(curData.wind.speed),
        });

        const list = foreRes.data?.list || [];
        const dailyMap = {};
        list.forEach((item) => {
          const dateStr = item.dt_txt.split(" ")[0];
          if (!dailyMap[dateStr] && item.dt_txt.includes("12:00:00")) {
            dailyMap[dateStr] = item;
          }
        });

        const days = Object.values(dailyMap).slice(0, 5);
        if (days.length === 0 && list.length > 0) {
          for (let i = 0; i < list.length; i += 8) {
            if (days.length < 5) days.push(list[i]);
          }
        }

        setForecast(
          days.map((item) => ({
            date: formatDateTr(item.dt_txt),
            tempMax: Math.round(item.main.temp_max),
            tempMin: Math.round(item.main.temp_min),
            icon: mapOwmIcon(item.weather?.[0]?.icon),
            rainProb: Math.round((item.pop || 0) * 100),
          }))
        );
      })
      .catch(() => {
        if (active) {
          setCurrent({ temp: 18, desc: "Parçalı Bulutlu", icon: "⛅", humidity: 55, wind: 3 });
          setForecast([
            { date: "15 Kas Paz", tempMax: 20, tempMin: 9, icon: "☀️", rainProb: 10 },
            { date: "16 Kas Pzt", tempMax: 17, tempMin: 9, icon: "🌧️", rainProb: 65 },
            { date: "17 Kas Sal", tempMax: 16, tempMin: 9, icon: "🌧️", rainProb: 40 },
            { date: "18 Kas Çar", tempMax: 14, tempMin: 11, icon: "🌧️", rainProb: 80 },
            { date: "19 Kas Per", tempMax: 15, tempMin: 8, icon: "⛅", rainProb: 20 },
          ]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [field?.lat, field?.lon]);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        height: "100%",
      }}
    >
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>
          Parsel Hava Durumu & 5 Günlük Tahmin
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
          {field?.name} ({field?.lat?.toFixed(2)}, {field?.lon?.toFixed(2)})
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "30px", color: "#6b7280", fontSize: "13px" }}>
          Meteoroloji verileri yükleniyor...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Anlık Durum Özet Kutusu */}
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "28px" }}>{current?.icon || "⛅"}</span>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 800, color: "#065f46" }}>ANLIK DURUM</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#111827" }}>{current?.temp}°C</div>
                <div style={{ fontSize: "12px", color: "#374151" }}>{current?.desc}</div>
              </div>
            </div>
            <div style={{ fontSize: "11px", color: "#4b5563", textAlign: "right" }}>
              <div>Nem: %{current?.humidity}</div>
              <div>Rüzgar: {current?.wind} km/s</div>
            </div>
          </div>

          {/* 5 Günlük Tahminler */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>
              5 Günlük Tahmin (Dikey Liste)
            </div>
            {forecast.map((day, idx) => (
              <div
                key={idx}
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1f2937", minWidth: "90px" }}>
                  {day.date}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "18px" }}>{day.icon}</span>
                  <span style={{ fontSize: "13px", color: "#4b5563" }}>💧 %{day.rainProb}</span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                  {day.tempMax}° / <span style={{ color: "#6b7280", fontWeight: 500 }}>{day.tempMin}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}