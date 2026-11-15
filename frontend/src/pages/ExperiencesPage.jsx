import React, { useEffect, useState } from "react";

export default function ExperiencesPage({ user, onBack }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Tümü");
  const [selectedCrop, setSelectedCrop] = useState("Tümü");

  // Veritabanından gerçek deneyimleri çek
useEffect(() => {
  const fetchExperiences = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/experiences");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Deneyimler yüklenemedi.");
      }

      if (Array.isArray(data)) {
        setExperiences(data);
      } else {
        console.error("Beklenmeyen API yanıtı:", data);
        setExperiences([]);
      }
    } catch (error) {
      console.error("Deneyimler yüklenirken hata oluştu:", error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  fetchExperiences();
}, []);

  // 1. Veritabanından gelen verilere göre benzersiz (unique) şehir listesini türet
  const uniqueCities = ["Tümü", ...new Set(experiences.map((exp) => exp.city).filter(Boolean))];

  // 2. Veritabanından gelen verilere göre benzersiz (unique) ürün listesini türet
  const uniqueCrops = ["Tümü", ...new Set(experiences.map((exp) => exp.crop).filter(Boolean))];

  const filtered = experiences.filter((exp) => {
    return (
      (selectedCity === "Tümü" || exp.city === selectedCity) &&
      (selectedCrop === "Tümü" || exp.crop === selectedCrop)
    );
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111827", margin: 0 }}>
            Güneydoğu Anadolu Yakın Çevre Deneyimleri (Canlı Veritabanı)
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
            Sistemdeki diğer üreticilerin gerçek saha planlarını tamamlama sonuçlarını inceleyin.
          </p>
        </div>

        {/* Dinamik ve Tekilleştirilmiş Filtreler */}
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Şehir Seçimi */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              background: "#ffffff",
              outline: "none",
            }}
          >
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city === "Tümü" ? "Tüm Şehirler" : city}
              </option>
            ))}
          </select>

          {/* Ürün Seçimi */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              background: "#ffffff",
              outline: "none",
            }}
          >
            {uniqueCrops.map((crop) => (
              <option key={crop} value={crop}>
                {crop === "Tümü" ? "Tüm Ürünler" : crop}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          Veritabanından deneyimler yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
            Henüz veritabanında kayıtlı uygun deneyim bulunmuyor.
          </p>
          <p style={{ fontSize: "14px", margin: 0 }}>
            Tarla Paneli üzerinden bir planı tamamlayıp geri bildirim gönderdiğinizde burada listelenecektir.
          </p>
        </div>
      ) : (
        /* Kart Listesi */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px",
          }}
        >
          {filtered.map((exp) => (
            <div
              key={exp.id}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "#ecfdf5",
                      color: "#064e3b",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    {exp.city} / {exp.district}
                  </span>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>
                    {exp.crop}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    Üretici: {exp.farmer} ({exp.farmName}) • {exp.date}
                  </span>
                </div>
                <span
                  style={{
                    padding: "6px 10px",
                    background: "#f0fdf4",
                    color: "#15803d",
                    fontWeight: 700,
                    fontSize: "13px",
                    borderRadius: "8px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  {exp.result}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#6b7280",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Uygulanan Strateji
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                    {exp.strategy}
                  </span>
                </div>

                <div
                  style={{
                    background: "#f9fafb",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#6b7280",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Üretici Gözlem Notu
                  </span>
                  <span style={{ fontSize: "13px", color: "#4b5563" }}>{exp.note}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f3f4f6",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                <span>
                  Sistem Puanı: <strong style={{ color: "#111827" }}>{exp.rating}</strong>
                </span>
                <button
                  onClick={() => alert(`Kayıt ID: ${exp.id} - Bu plan veritabanından başarıyla çekilmiştir.`)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#064e3b",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Analizi İncele &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}