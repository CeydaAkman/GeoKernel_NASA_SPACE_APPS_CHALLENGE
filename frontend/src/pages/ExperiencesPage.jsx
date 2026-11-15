import React, { useEffect, useState } from "react";

<<<<<<< HEAD
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState("Tümü");
  const [selectedCrop, setSelectedCrop] = useState("Tümü");

  const [selectedExperienceId, setSelectedExperienceId] =
    useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/experiences`
      );
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522

      const data = await response.json();

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error(
          data?.detail ||
            "Deneyimler veritabanından yüklenemedi."
        );
      }

      // API farklı bir response yapısı döndürürse
      // sadece gerçek API verisini kullanıyoruz.
      if (Array.isArray(data)) {
        setExperiences(data);
      } else if (Array.isArray(data?.experiences)) {
        setExperiences(data.experiences);
      } else {
        setExperiences([]);
      }
    } catch (err) {
      console.error(
        "Deneyimler yüklenirken hata:",
        err
      );

      setError(
        err.message ||
          "Deneyimler yüklenirken bir hata oluştu."
      );

=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
      setExperiences([]);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }

  const cities = [
    "Tümü",
    ...Array.from(
      new Set(
        experiences
          .map((item) => item.city)
          .filter(Boolean)
      )
    ),
  ];

  const crops = [
    "Tümü",
    ...Array.from(
      new Set(
        experiences
          .map((item) => item.crop)
          .filter(Boolean)
      )
    ),
  ];

  const filteredExperiences = experiences.filter((item) => {
    const cityMatches =
      selectedCity === "Tümü" ||
      item.city === selectedCity;

    const cropMatches =
      selectedCrop === "Tümü" ||
      item.crop === selectedCrop;

    return cityMatches && cropMatches;
  });

  function toggleAnalysis(id) {
    setSelectedExperienceId((currentId) =>
      currentId === id ? null : id
    );
  }

  return (
    <div style={styles.page}>
      {/* BAŞLIK */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Güneydoğu Anadolu Yakın Çevre Deneyimleri
          </h1>

          <p style={styles.subtitle}>
            Sistemdeki diğer üreticilerin gerçek saha
            planlarını ve uygulama sonuçlarını inceleyin.
          </p>
        </div>

        {/* FİLTRELER */}
        <div style={styles.filters}>
          <select
            value={selectedCity}
            onChange={(e) =>
              setSelectedCity(e.target.value)
            }
            style={styles.select}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === "Tümü"
                  ? "Tüm Şehirler"
                  : city}
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
              </option>
            ))}
          </select>

<<<<<<< HEAD
          <select
            value={selectedCrop}
            onChange={(e) =>
              setSelectedCrop(e.target.value)
            }
            style={styles.select}
          >
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop === "Tümü"
                  ? "Tüm Ürünler"
                  : crop}
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
              </option>
            ))}
          </select>
        </div>
      </div>

<<<<<<< HEAD
      {/* YÜKLENİYOR */}
      {loading && (
        <div style={styles.messageBox}>
          Deneyimler veritabanından yükleniyor...
        </div>
      )}

      {/* HATA */}
      {!loading && error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* KAYIT YOK */}
      {!loading &&
        !error &&
        filteredExperiences.length === 0 && (
          <div style={styles.messageBox}>
            Seçilen kriterlere uygun bir deneyim
            bulunamadı.
          </div>
        )}

      {/* DENEYİM KARTLARI */}
      {!loading &&
        !error &&
        filteredExperiences.length > 0 && (
          <div style={styles.grid}>
            {filteredExperiences.map((experience) => {
              const isOpen =
                selectedExperienceId === experience.id;

              return (
                <div
                  key={experience.id}
                  style={{
                    ...styles.card,

                    ...(isOpen
                      ? styles.cardOpen
                      : {}),
                  }}
                >
                  {/* KART ÜST BÖLÜM */}
                  <div style={styles.cardTop}>
                    <div style={styles.locationBadge}>
                      {formatLocation(experience)}
                    </div>

                    <div style={styles.yieldBadge}>
                      {formatYield(
                        getYieldValue(experience)
                      )}
                    </div>
                  </div>

                  {/* ÜRÜN */}
                  <h2 style={styles.cropName}>
                    {experience.crop ||
                      "Ürün bilgisi bulunamadı"}
                  </h2>

                  {/* ÜRETİCİ */}
                  <p style={styles.producer}>
                    Üretici:{" "}
                    {experience.farmer ||
                      experience.producer ||
                      "Bilinmiyor"}

                    {getDateValue(experience)
                      ? ` • ${getDateValue(
                          experience
                        )}`
                      : ""}
                  </p>

                  {/* UYGULANAN PLAN */}
                  <InfoSection
                    title="Uygulanan Plan"
                    value={
                      experience.strategy ||
                      experience.applied_strategy ||
                      "Plan bilgisi bulunamadı."
                    }
                  />

                  {/* ÜRETİCİ NOTU */}
                  <InfoSection
                    title="Üreticinin Deneyimi"
                    value={
                      experience.note ||
                      experience.observation_note ||
                      "Üretici tarafından ek bir not girilmedi."
                    }
                  />

                  {/* ALT BÖLÜM */}
                  <div style={styles.cardFooter}>
                    <div style={styles.rating}>
                      Sistem Puanı:{" "}

                      <strong>
                        {formatRating(experience)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleAnalysis(
                          experience.id
                        )
                      }
                      style={styles.analysisButton}
                    >
                      {isOpen
                        ? "Analizi Kapat ↑"
                        : "Analizi İncele →"}
                    </button>
                  </div>

                  {/* DETAYLI ANALİZ */}
                  {isOpen && (
                    <ExperienceAnalysis
                      experience={experience}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}


/* =========================================================
   DENEYİM DETAYI
========================================================= */

function ExperienceAnalysis({ experience }) {
  const yieldValue =
    getYieldValue(experience);

  const crop =
    experience.crop ||
    "Bu ürün";

  const city =
    experience.city ||
    "";

  const strategy =
    experience.strategy ||
    experience.applied_strategy ||
    "Plan bilgisi bulunamadı.";

  const note =
    experience.note ||
    experience.observation_note ||
    "Üretici tarafından ek bir deneyim notu girilmedi.";

  return (
    <div style={styles.analysisContainer}>
      {/* BAŞLIK */}
      <div style={styles.analysisHeader}>
        <h3 style={styles.analysisTitle}>
          🌱 Bu Deneyimden Ne Öğrendik?
        </h3>

        <p style={styles.analysisSubtitle}>
          {city
            ? `${city} bölgesinde ${crop} için uygulanan planın sonucu.`
            : `${crop} için uygulanan planın sonucu.`}
        </p>
      </div>

      {/* ELDE EDİLEN VERİM */}
      <div style={styles.resultCard}>
        <div style={styles.resultLabel}>
          ELDE EDİLEN VERİM
        </div>

        <div style={styles.resultValue}>
          {yieldValue !== null &&
          yieldValue !== undefined &&
          yieldValue !== ""
            ? formatYield(yieldValue)
            : "Verim bilgisi paylaşılmamış"}
        </div>

        {yieldValue !== null &&
          yieldValue !== undefined &&
          yieldValue !== "" && (
            <p style={styles.resultDescription}>
              Bu üreticinin uygulama sonucunda
              kaydettiği verim.
            </p>
          )}
      </div>

      {/* UYGULANAN PLAN */}
      <div style={styles.analysisInfoCard}>
        <div style={styles.analysisInfoLabel}>
          📋 UYGULANAN PLAN
        </div>

        <div style={styles.analysisInfoValue}>
          {strategy}
        </div>
      </div>

      {/* ÜRETİCİ DENEYİMİ */}
      <div style={styles.noteCard}>
        <div style={styles.noteLabel}>
          💬 ÜRETİCİNİN DENEYİMİ
        </div>

        <div style={styles.noteValue}>
          {note}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   BİLGİ KARTI
========================================================= */

function InfoSection({ title, value }) {
  return (
    <div style={styles.infoSection}>
      <div style={styles.infoTitle}>
        {title}
      </div>

      <div style={styles.infoValue}>
        {value}
      </div>
    </div>
  );
}


/* =========================================================
   VERİ OKUMA FONKSİYONLARI
========================================================= */

/*
  Verim için sadece API / veritabanından gelen
  gerçek alanlar okunur.

  Mock veya sabit verim değeri YOKTUR.
*/
function getYieldValue(experience) {
  return (
    experience.actual_yield_kg_da ??
    experience.estimated_yield_kg_da ??
    experience.actualYieldKgDa ??
    experience.estimatedYieldKgDa ??
    experience.yield_kg_da ??
    experience.yield ??
    experience.result ??
    null
  );
}


/*
  API'den gelen verimi kullanıcıya anlaşılır gösterir.
*/
function formatYield(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Verim bilgisi yok";
  }

  // API zaten "320 kg/da" gibi gönderdiyse
  if (typeof value === "string") {
    const lowerValue = value.toLowerCase();

    if (
      lowerValue.includes("kg/da") ||
      lowerValue.includes("kg / da")
    ) {
      return value;
    }

    const cleanedValue = value
      .replace(",", ".")
      .replace(/[^\d.-]/g, "");

    const numericValue = Number(cleanedValue);

    if (Number.isFinite(numericValue)) {
      return `${new Intl.NumberFormat("tr-TR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(numericValue)} kg/da`;
    }

    return value;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Verim bilgisi yok";
  }

  return `${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(numericValue)} kg/da`;
}


function formatLocation(experience) {
  const city =
    experience.city ||
    "";

  const district =
    experience.district ||
    "";

  if (city && district) {
    return `${city} / ${district}`;
  }

  if (city) {
    return city;
  }

  if (district) {
    return district;
  }

  return "Konum bilgisi yok";
}


function getDateValue(experience) {
  return (
    experience.date ||
    experience.created_at ||
    experience.createdAt ||
    null
  );
}


function formatRating(experience) {
  const rating =
    experience.rating ??
    experience.score ??
    experience.system_score;

  if (
    rating === null ||
    rating === undefined
  ) {
    return "Puanlanmamış";
  }

  return `${rating} / 5`;
}


/* =========================================================
   STİLLER
========================================================= */

const styles = {
  page: {
    width: "100%",
    minHeight: "100%",
    padding: "28px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    color: "#111827",
  },

  subtitle: {
    margin: "8px 0 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  select: {
    minWidth: "150px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "14px",
    outline: "none",
  },

  messageBox: {
    padding: "30px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    textAlign: "center",
    color: "#64748b",
  },

  errorBox: {
    padding: "18px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#991b1b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
    alignItems: "start",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "22px",
    boxSizing: "border-box",
    boxShadow:
      "0 2px 8px rgba(15, 23, 42, 0.04)",
    transition: "0.2s ease",
  },

  cardOpen: {
    border: "2px solid #047857",
    boxShadow:
      "0 4px 18px rgba(6, 78, 59, 0.10)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px",
  },

  locationBadge: {
    display: "inline-block",
    padding: "6px 10px",
    background: "#ecfdf5",
    color: "#065f46",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: 700,
  },

  yieldBadge: {
    padding: "7px 11px",
    background: "#f0fdf4",
    color: "#047857",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  cropName: {
    margin: "0 0 5px 0",
    color: "#111827",
    fontSize: "20px",
    lineHeight: 1.35,
    fontWeight: 800,
  },

  producer: {
    margin: "0 0 16px 0",
    color: "#64748b",
    fontSize: "12px",
  },

  infoSection: {
    background: "#f8fafc",
    border: "1px solid #eef2f7",
    borderRadius: "10px",
    padding: "13px",
    marginBottom: "10px",
  },

  infoTitle: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 800,
    marginBottom: "7px",
  },

  infoValue: {
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginTop: "18px",
    paddingTop: "15px",
    borderTop: "1px solid #e5e7eb",
  },

  rating: {
    color: "#64748b",
    fontSize: "12px",
  },

  analysisButton: {
    border: "none",
    background: "transparent",
    color: "#065f46",
    fontWeight: 800,
    fontSize: "13px",
    cursor: "pointer",
    padding: "5px",
  },

  analysisContainer: {
    marginTop: "18px",
    paddingTop: "20px",
    borderTop: "1px solid #d1d5db",
  },

  analysisHeader: {
    marginBottom: "15px",
  },

  analysisTitle: {
    margin: 0,
    color: "#065f46",
    fontSize: "17px",
    fontWeight: 800,
  },

  analysisSubtitle: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  resultCard: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
  },

  resultLabel: {
    color: "#047857",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.4px",
    marginBottom: "6px",
  },

  resultValue: {
    color: "#065f46",
    fontSize: "26px",
    fontWeight: 800,
  },

  resultDescription: {
    margin: "6px 0 0 0",
    color: "#047857",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  analysisInfoCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px",
  },

  analysisInfoLabel: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: 800,
    marginBottom: "7px",
  },

  analysisInfoValue: {
    color: "#1f2937",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.5,
  },

  noteCard: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "10px",
    padding: "14px",
  },

  noteLabel: {
    color: "#92400e",
    fontSize: "11px",
    fontWeight: 800,
    marginBottom: "7px",
  },

  noteValue: {
    color: "#374151",
    fontSize: "14px",
    lineHeight: 1.6,
  },
};
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
