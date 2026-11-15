export default function FieldDetailsCard({ field, analysis, loading }) {
  const chartData = analysis?.chart_data || [];
  const latestYear = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const recentThree = chartData.slice(-3);

  const avgRain =
    recentThree.length > 0
      ? Math.round(
          recentThree.reduce((acc, item) => acc + (item.rainfall_mm || 0), 0) /
            recentThree.length
        )
      : null;

  const currentMoisturePct = latestYear?.root_moisture
    ? Math.round(latestYear.root_moisture * 100)
    : null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        minHeight: "465px",
      }}
    >
      {/* Üst Başlık ve Uydu Rozeti */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Tarla Fiziksel & İklim Özellikleri
        </h2>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#065f46",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
        >
          {loading ? "Güncelleniyor..." : "NASA POWER / SMAP"}
        </span>
      </div>

      {/* 1. Parsel Kimliği ve Konum */}
      <div
        style={{
          padding: "12px 14px",
          background: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 700 }}>
          PARSEL KİMLİĞİ & KONUM
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#111827",
            marginTop: "3px",
          }}
        >
          {field?.name}
        </div>
        <div style={{ fontSize: "13px", color: "#4b5563", marginTop: "2px" }}>
          {field?.city && field?.district
            ? `${field.city} / ${field.district} • `
            : ""}
          {field?.lat.toFixed(4)}° K, {field?.lon.toFixed(4)}° D
        </div>
      </div>

      {/* 2. Arazi Fiziksel Metrikleri (Yağış, Toprak Nemi, Havza Tipi) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        <div
          style={{
            padding: "11px 12px",
            background: "#f0f9ff",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
          }}
        >
          <div style={{ fontSize: "11px", color: "#0369a1", fontWeight: 700 }}>
            3 YILLIK ORT. YAĞIŞ
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#0c4a6e",
              marginTop: "4px",
            }}
          >
            {avgRain ? `${avgRain} mm` : "—"}
          </div>
        </div>

        <div
          style={{
            padding: "11px 12px",
            background: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
          }}
        >
          <div style={{ fontSize: "11px", color: "#15803d", fontWeight: 700 }}>
            KÖK BÖLGESİ NEMİ
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#14532d",
              marginTop: "4px",
            }}
          >
            {currentMoisturePct !== null ? `%${currentMoisturePct}` : "—"}
          </div>
        </div>

        <div
          style={{
            padding: "11px 12px",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 700 }}>
            ÜRETİM REJİMİ
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              marginTop: "5px",
            }}
          >
            Kuru Tarım (Yağışa Dayalı)
          </div>
        </div>
      </div>

      {/* 3. İklim İkizi (Climate Analogue) Analizi */}
      <div
        style={{
          padding: "14px",
          background: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#6b7280",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          İKLİM KAYMASI & ANALOG HAVZA PROFİLİ
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#1f2937",
            lineHeight: "1.55",
          }}
        >
          {analysis?.climate_analogue ||
            "Uydu verileri üzerinden iklim benzerlik profili yükleniyor..."}
        </p>
      </div>
    </div>
  );
}