import { useEffect, useState } from "react";
import { analyzeField, getStrategyCrops } from "../api";

export default function StrategyPage({ field, onBack, onOpenPlan }) {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStrategy() {
      if (!field) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Ürün adları ve referans bilgileri yalnızca Excel'den oluşturulan crop_data.json'dan gelir.
        const strategyResponse = await getStrategyCrops(
          field.city || "Türkiye",
          field.crop || ""
        );

        const cropItems = strategyResponse.strategies || [];

        // Her JSON ürünü aynı seçili tarla koordinatında analiz edilir.
        const itemsWithAnalysis = await Promise.all(
          cropItems.map(async (crop) => {
            try {
              const analysis = await analyzeField(
                field.lat,
                field.lon,
                crop.name,
                field.name
              );
              return { ...crop, analysis };
            } catch (analysisError) {
              return { ...crop, analysis: null };
            }
          })
        );

        if (!cancelled) {
          setStrategies(itemsWithAnalysis);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.detail ||
              err?.message ||
              "Ekim stratejisi verileri yüklenemedi."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStrategy();
    return () => {
      cancelled = true;
    };
  }, [field?.id, field?.lat, field?.lon, field?.city, field?.crop]);

  // EĞER tarla seçilmemişse veya yeni kullanıcı tarlası yoksa boş durum ekranı göster
  if (!field) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <h2 style={{ color: "#111827", margin: "0 0 10px 0", fontSize: "20px" }}>Kayıtlı Tarlanız Bulunmuyor</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 20px 0" }}>
            Ekim stratejilerini ve alternatif ürün analizlerini görüntüleyebilmek için önce panelden bir tarla eklemelisiniz.
          </p>
          <button style={styles.button} onClick={onBack}>
            ← Tarla Paneline Dön ve Tarla Ekle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>EKİM STRATEJİSİ</div>
          <h1 style={styles.title}>{field.name}</h1>
          <div style={styles.meta}>
            {field.city || "Şehir belirtilmemiş"}
            {field.district ? ` / ${field.district}` : ""}
            {" • "}{Number(field.lat).toFixed(4)}, {Number(field.lon).toFixed(4)}
          </div>
        </div>
        <button style={styles.button} onClick={onBack}>← Tarla Paneline Dön</button>
      </header>

      <section style={styles.selectedBanner}>
        <div style={styles.cropBadge}>🌱 SEÇİLEN EKİN</div>
        <div>
          <h2 style={{ margin: "6px 0" }}>{field.crop || "Belirtilmemiş"}</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Kartlardaki ürün adları, üretim bilgileri ve bölgesel eşleşmeler Excel'den oluşturulan crop_data.json veri setinden alınır.
          </p>
        </div>
      </section>

      {loading && (
        <div style={styles.loading}>🌍 Excel kaynaklı ürün verileri ve tarla analizleri yükleniyor...</div>
      )}

      {!loading && error && <div style={styles.error}>{error}</div>}

      {!loading && !error && strategies.length > 0 && (
        <section style={styles.strategyGrid}>
          {strategies.map((strategy, index) => (
            <StrategyCard
              key={`${strategy.name}-${index}`}
              strategy={strategy}
              index={index}
              onApply={() => {
                const operations = strategy.analysis?.impact_metrics?.operations || [];
                if (!operations.length) {
                  alert("Bu ürün için plan henüz oluşturulamadı.");
                  return;
                }
                onOpenPlan({ field, crop: strategy.name, operations });
              }}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function StrategyCard({ strategy, index, onApply }) {
  const metrics = strategy.analysis?.impact_metrics || {};
  const selected = Boolean(strategy.isSelectedCrop) || index === 0;

  return (
    <article style={{ ...styles.strategyCard, ...(selected ? styles.selectedCard : {}) }}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardTag}>{selected ? "MEVCUT / SEÇİLEN ÜRÜN" : "ALTERNATİF ÜRÜN"}</div>
          <h2 style={styles.cropName}>{strategy.name}</h2>
          <div style={styles.cropCategory}>{strategy.category || "Bitkisel ürün"}</div>
        </div>
      </div>

      <Metric
        label="SU TASARRUFU MİKTARI"
        value={formatWater(metrics.water_saved_m3_da)}
        progress={toProgress(metrics.water_saved_m3_da, 350)}
        barStyle={styles.waterBar}
      />
      <Metric
        label="TOPRAK VERİM ETKİSİ"
        value={formatSoil(metrics.soil_fertility_change)}
      />
      <Metric
        label="KAYNAK VE GİRDİ TASARRUFU"
        value={formatPercent(metrics.resource_saving_pct)}
        progress={toProgress(metrics.resource_saving_pct, 40)}
        barStyle={styles.resourceBar}
      />

      <button style={styles.planButton} onClick={onApply}>
        Planı Uygula →
      </button>
    </article>
  );
}

function Metric({ label, value, progress, barStyle }) {
  return (
    <div style={styles.metricBox}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>

      {progress != null && (
        <div style={styles.metricTrack}>
          <div
            style={{
              ...styles.metricFill,
              ...barStyle,
              width: `${progress}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function toProgress(value, max) {
  if (value == null || Number.isNaN(Number(value))) return 0;
  return Math.max(8, Math.min(100, (Math.abs(Number(value)) / max) * 100));
}

function formatWater(value) {
  return value != null ? `${formatNumber(value)} m³ / da` : "Analiz bekleniyor";
}
function formatSoil(value) {
  if (value == null) return "Analiz bekleniyor";
  return `${Number(value) > 0 ? "+" : ""}${formatNumber(value)} Verim Endeksi`;
}
function formatPercent(value) {
  return value != null ? `%${formatNumber(value)} Daha Az Girdi` : "Analiz bekleniyor";
}
function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Number(value));
}

// Tasarım aynı sayfa dilinde tutuldu; veri kaynağı mock yerine JSON + mevcut analiz endpointidir.
const styles = {
  page: { minHeight: "100vh", padding: "32px", background: "#f5f7f3", color: "#1f2937" },
  header: { display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "flex-start", marginBottom: "24px" },
  kicker: { fontSize: "12px", fontWeight: 800, letterSpacing: "1.2px", color: "#4b7a55" },
  title: { margin: "6px 0", fontSize: "34px" },
  meta: { color: "#64748b" },
  button: { border: "1px solid #cbd5e1", background: "white", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
  selectedBanner: { display: "flex", gap: "16px", alignItems: "center", padding: "20px", borderRadius: "16px", background: "#163b25", color: "white", marginBottom: "22px" },
  cropBadge: { fontSize: "12px", fontWeight: 800, padding: "8px 10px", borderRadius: "999px", background: "rgba(255,255,255,.14)" },
  loading: { padding: "28px", background: "white", borderRadius: "16px", textAlign: "center" },
  error: { padding: "18px", background: "#fee2e2", color: "#991b1b", borderRadius: "12px" },
  emptyContainer: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7f3", padding: "20px" },
  emptyCard: { background: "white", padding: "32px", borderRadius: "16px", textAlign: "center", maxWidth: "440px", border: "1px solid #d1d5db", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  strategyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" },
  strategyCard: { background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid transparent" },
  selectedCard: { border: "2px solid #4b7a55" },
  cardHeader: { minHeight: "74px" },
  cardTag: { fontSize: "10px", color: "#4b7a55", fontWeight: 800, letterSpacing: ".8px", marginBottom: "6px" },
  cropName: { margin: 0, fontSize: "22px" },
  cropCategory: { marginTop: "5px", color: "#64748b", fontSize: "13px" },
  metricBox: { padding: "14px", border: "1px solid #e2e8f0", borderRadius: "10px" },
  metricLabel: { fontSize: "11px", color: "#64748b", fontWeight: 800, marginBottom: "6px" },
  metricValue: { fontWeight: 800, fontSize: "18px" },
  metricTrack: { height: "7px", marginTop: "12px", background: "#edf1ed", borderRadius: "999px", overflow: "hidden" },
  metricFill: { height: "100%", borderRadius: "999px", transition: "width .25s ease" },
  waterBar: { background: "#1d8acb" },
  resourceBar: { background: "#c96b24" },
  planButton: { marginTop: "auto", background: "#163b25", color: "white", border: 0, padding: "13px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: 800 },
};