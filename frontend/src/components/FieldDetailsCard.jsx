export default function FieldDetailsCard({ field, analysis, loading }) {
  const chartData = analysis?.chart_data || [];
<<<<<<< HEAD
  const latestYear =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;

  const recentThree = chartData.slice(-3);

  // Son 3 yılın ortalama yağışı
  const avgRain =
    recentThree.length > 0
      ? Math.round(
          recentThree.reduce(
            (acc, item) => acc + (item.rainfall_mm || 0),
            0
          ) / recentThree.length
        )
      : null;

  // Güncel toprak nemi
  const currentMoisturePct =
    latestYear?.root_moisture !== undefined &&
    latestYear?.root_moisture !== null
      ? Math.round(latestYear.root_moisture * 100)
      : null;

  // Kullanıcının anlayacağı sade iklim açıklaması
  const climateDescription = analysis?.climate_analogue
    ? analysis.climate_analogue
    : "Tarlanızın iklim koşulları analiz edilerek benzer iklime sahip bölgeler belirleniyor...";
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522

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
<<<<<<< HEAD
      {/* Başlık */}
=======
      {/* Üst Başlık ve Uydu Rozeti */}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
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
<<<<<<< HEAD
          Tarla ve İklim Bilgileri
        </h2>

=======
          Tarla Fiziksel & İklim Özellikleri
        </h2>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
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
<<<<<<< HEAD
          {loading ? "Güncelleniyor..." : "NASA POWER"}
        </span>
      </div>

      {/* Tarla Konumu */}
=======
          {loading ? "Güncelleniyor..." : "NASA POWER / SMAP"}
        </span>
      </div>

      {/* 1. Parsel Kimliği ve Konum */}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
      <div
        style={{
          padding: "12px 14px",
          background: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
<<<<<<< HEAD
        <div
          style={{
            fontSize: "11px",
            color: "#6b7280",
            fontWeight: 700,
          }}
        >
          TARLANIZ
        </div>

=======
        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 700 }}>
          PARSEL KİMLİĞİ & KONUM
        </div>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#111827",
            marginTop: "3px",
          }}
        >
<<<<<<< HEAD
          {field?.name || "Tarla bilgisi bulunamadı"}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#4b5563",
            marginTop: "2px",
          }}
        >
          {field?.city && field?.district
            ? `${field.city} / ${field.district} • `
            : ""}

          {field?.lat !== undefined && field?.lon !== undefined
            ? `${field.lat.toFixed(4)}° K, ${field.lon.toFixed(4)}° D`
            : ""}
        </div>
      </div>

      {/* Temel Bilgiler */}
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
<<<<<<< HEAD
        {/* Yağış */}
=======
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        <div
          style={{
            padding: "11px 12px",
            background: "#f0f9ff",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
          }}
        >
<<<<<<< HEAD
          <div
            style={{
              fontSize: "11px",
              color: "#0369a1",
              fontWeight: 700,
            }}
          >
            ORTALAMA YAĞIŞ
          </div>

=======
          <div style={{ fontSize: "11px", color: "#0369a1", fontWeight: 700 }}>
            3 YILLIK ORT. YAĞIŞ
          </div>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#0c4a6e",
              marginTop: "4px",
            }}
          >
<<<<<<< HEAD
            {avgRain !== null ? `${avgRain} mm` : "—"}
          </div>

          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              marginTop: "3px",
            }}
          >
            Son 3 yıl
          </div>
        </div>

        {/* Toprak Nemi */}
=======
            {avgRain ? `${avgRain} mm` : "—"}
          </div>
        </div>

>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        <div
          style={{
            padding: "11px 12px",
            background: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
          }}
        >
<<<<<<< HEAD
          <div
            style={{
              fontSize: "11px",
              color: "#15803d",
              fontWeight: 700,
            }}
          >
            TOPRAK NEMİ
          </div>

=======
          <div style={{ fontSize: "11px", color: "#15803d", fontWeight: 700 }}>
            KÖK BÖLGESİ NEMİ
          </div>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#14532d",
              marginTop: "4px",
            }}
          >
<<<<<<< HEAD
            {currentMoisturePct !== null
              ? `%${currentMoisturePct}`
              : "—"}
          </div>

          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              marginTop: "3px",
            }}
          >
            Kök bölgesi
          </div>
        </div>

        {/* Tarım Durumu */}
=======
            {currentMoisturePct !== null ? `%${currentMoisturePct}` : "—"}
          </div>
        </div>

>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        <div
          style={{
            padding: "11px 12px",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
<<<<<<< HEAD
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            TARIM ŞEKLİ
          </div>

=======
          <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 700 }}>
            ÜRETİM REJİMİ
          </div>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              marginTop: "5px",
            }}
          >
<<<<<<< HEAD
            Kuru Tarım
          </div>

          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              marginTop: "3px",
            }}
          >
            Yağışa dayalı
=======
            Kuru Tarım (Yağışa Dayalı)
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Kullanıcı Dostu İklim Bilgisi */}
=======
      {/* 3. İklim İkizi (Climate Analogue) Analizi */}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
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
<<<<<<< HEAD
            marginBottom: "8px",
          }}
        >
          TARLANIZIN İKLİM DURUMU
        </div>

=======
            marginBottom: "6px",
          }}
        >
          İKLİM KAYMASI & ANALOG HAVZA PROFİLİ
        </div>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#1f2937",
            lineHeight: "1.55",
          }}
        >
<<<<<<< HEAD
          {climateDescription}
=======
          {analysis?.climate_analogue ||
            "Uydu verileri üzerinden iklim benzerlik profili yükleniyor..."}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        </p>
      </div>
    </div>
  );
}