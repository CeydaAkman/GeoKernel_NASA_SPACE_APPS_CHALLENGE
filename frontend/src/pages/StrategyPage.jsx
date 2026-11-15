<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
import { analyzeField, getStrategyCrops } from "../api";

export default function StrategyPage({ field, onBack, onOpenPlan }) {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

<<<<<<< HEAD
  const mostProducedCrop = useMemo(() => {
    if (!Array.isArray(strategies) || strategies.length === 0) {
      return null;
    }

    return strategies.reduce((highestCrop, currentCrop) => {
      const currentProduction = getProductionValue(currentCrop);
      const highestProduction = getProductionValue(highestCrop);

      return currentProduction > highestProduction
        ? currentCrop
        : highestCrop;
    });
  }, [strategies]);

=======
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
  useEffect(() => {
    let cancelled = false;

    async function loadStrategy() {
      if (!field) {
<<<<<<< HEAD
        setStrategies([]);
=======
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

<<<<<<< HEAD
        // Ürün listesi API'den alınır.
        const strategyResponse = await getStrategyCrops(
          field.city || "",
          field.crop || ""
        );

        const cropItems = Array.isArray(strategyResponse?.strategies)
          ? strategyResponse.strategies
          : [];

        // Her ürün için gerçek tarla koordinatlarıyla analiz yapılır.
=======
        // Ürün adları ve referans bilgileri yalnızca Excel'den oluşturulan crop_data.json'dan gelir.
        const strategyResponse = await getStrategyCrops(
          field.city || "Türkiye",
          field.crop || ""
        );

        const cropItems = strategyResponse.strategies || [];

        // Her JSON ürünü aynı seçili tarla koordinatında analiz edilir.
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        const itemsWithAnalysis = await Promise.all(
          cropItems.map(async (crop) => {
            try {
              const analysis = await analyzeField(
                field.lat,
                field.lon,
                crop.name,
                field.name
              );
<<<<<<< HEAD

              return {
                ...crop,
                analysis,
              };
            } catch (analysisError) {
              console.error(
                `${crop.name} için analiz hatası:`,
                analysisError
              );

              return {
                ...crop,
                analysis: null,
              };
=======
              return { ...crop, analysis };
            } catch (analysisError) {
              return { ...crop, analysis: null };
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            }
          })
        );

        if (!cancelled) {
          setStrategies(itemsWithAnalysis);
        }
      } catch (err) {
<<<<<<< HEAD
        console.error("Strateji yükleme hatası:", err);

        if (!cancelled) {
          setStrategies([]);

=======
        if (!cancelled) {
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          setError(
            err?.response?.data?.detail ||
              err?.message ||
              "Ekim stratejisi verileri yüklenemedi."
          );
        }
      } finally {
<<<<<<< HEAD
        if (!cancelled) {
          setLoading(false);
        }
=======
        if (!cancelled) setLoading(false);
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
      }
    }

    loadStrategy();
<<<<<<< HEAD

    return () => {
      cancelled = true;
    };
  }, [
    field?.id,
    field?.lat,
    field?.lon,
    field?.city,
    field?.crop,
    field?.name,
  ]);

=======
    return () => {
      cancelled = true;
    };
  }, [field?.id, field?.lat, field?.lon, field?.city, field?.crop]);

  // EĞER tarla seçilmemişse veya yeni kullanıcı tarlası yoksa boş durum ekranı göster
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
  if (!field) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
<<<<<<< HEAD
          <h2 style={styles.emptyTitle}>
            Kayıtlı Tarlanız Bulunmuyor
          </h2>

          <p style={styles.emptyText}>
            Ekim stratejilerini görüntüleyebilmek için önce
            bir tarla eklemelisiniz.
          </p>

          <button
            style={styles.button}
            onClick={onBack}
          >
            ← Tarla Paneline Dön
=======
          <h2 style={{ color: "#111827", margin: "0 0 10px 0", fontSize: "20px" }}>Kayıtlı Tarlanız Bulunmuyor</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 20px 0" }}>
            Ekim stratejilerini ve alternatif ürün analizlerini görüntüleyebilmek için önce panelden bir tarla eklemelisiniz.
          </p>
          <button style={styles.button} onClick={onBack}>
            ← Tarla Paneline Dön ve Tarla Ekle
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
<<<<<<< HEAD
          <div style={styles.kicker}>
            EKİM STRATEJİSİ
          </div>

          <h1 style={styles.title}>
            {field.name || "Tarla"}
          </h1>

          <div style={styles.meta}>
            {field.city || "Şehir belirtilmemiş"}

            {field.district
              ? ` / ${field.district}`
              : ""}

            {Number.isFinite(Number(field.lat)) &&
              Number.isFinite(Number(field.lon)) && (
                <>
                  {" • "}
                  {Number(field.lat).toFixed(4)},{" "}
                  {Number(field.lon).toFixed(4)}
                </>
              )}
          </div>
        </div>

        <button
          style={styles.button}
          onClick={onBack}
        >
          ← Tarla Paneline Dön
        </button>
      </header>

      <section style={styles.selectedBanner}>
        <div style={styles.bannerContent}>
          <div style={styles.bannerLabel}>
            BÖLGEDE EN ÇOK ÜRETİLEN ÜRÜN
          </div>

          <h2 style={styles.bannerTitle}>
            {loading
              ? "Yükleniyor..."
              : mostProducedCrop?.name ||
                "Üretim verisi bulunamadı"}
          </h2>

          {!loading &&
            !error &&
            mostProducedCrop && (
              <p style={styles.bannerDescription}>
                API'den alınan bölgesel üretim verilerine göre
                en yüksek üretim miktarına sahip ürün.
              </p>
            )}
        </div>

        {!loading &&
          !error &&
          mostProducedCrop &&
          getProductionValue(mostProducedCrop) > 0 && (
            <div style={styles.productionBox}>
              <div style={styles.productionLabel}>
                TOPLAM ÜRETİM
              </div>

              <div style={styles.productionValue}>
                {formatProduction(
                  getProductionValue(mostProducedCrop)
                )}
              </div>
            </div>
          )}
      </section>

      {loading && (
        <div style={styles.loading}>
          🌍 API verileri ve tarla analizleri yükleniyor...
        </div>
      )}

      {!loading && error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        strategies.length === 0 && (
          <div style={styles.loading}>
            Bu tarla için API'den uygun ürün verisi alınamadı.
          </div>
        )}

      {!loading &&
        !error &&
        strategies.length > 0 && (
          <section style={styles.strategyGrid}>
            {strategies.map((strategy, index) => (
              <StrategyCard
                key={`${strategy.name}-${index}`}
                strategy={strategy}
                mostProducedCropName={
                  mostProducedCrop?.name
                }
                onApply={() => {
                  const operations =
                    strategy.analysis?.impact_metrics
                      ?.operations || [];

                  if (!operations.length) {
                    alert(
                      "Bu ürün için API tarafından işlem planı oluşturulamadı."
                    );
                    return;
                  }

                  onOpenPlan({
                    field,
                    crop: strategy.name,
                    operations,
                  });
                }}
              />
            ))}
          </section>
        )}
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
    </div>
  );
}

<<<<<<< HEAD
/*
  API'den gelen üretim değerini okur.
*/
function getProductionValue(crop) {
  if (!crop) {
    return 0;
  }

  const rawValue =
    crop.production_amount ??
    crop.productionAmount ??
    crop.total_production ??
    crop.totalProduction ??
    crop.production ??
    crop.amount ??
    0;

  if (typeof rawValue === "number") {
    return Number.isFinite(rawValue)
      ? rawValue
      : 0;
  }

  if (typeof rawValue === "string") {
    const cleaned = rawValue
      .replace(/[^\d.,-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    const numericValue = Number(cleaned);

    return Number.isFinite(numericValue)
      ? numericValue
      : 0;
  }

  return 0;
}

function StrategyCard({
  strategy,
  mostProducedCropName,
  onApply,
}) {
  const metrics =
    strategy.analysis?.impact_metrics || {};

  const isSelectedCrop =
    Boolean(strategy.isSelectedCrop);

  const isMostProduced =
    strategy.name === mostProducedCropName;

  // Tahmini verim API analizinden alınır.
  const estimatedYield = getEstimatedYield(
    strategy.analysis,
    metrics
  );

  return (
    <article
      style={{
        ...styles.strategyCard,

        ...(isSelectedCrop
          ? styles.selectedCard
          : {}),

        ...(isMostProduced
          ? styles.mostProducedCard
          : {}),
      }}
    >
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardTag}>
            {isSelectedCrop
              ? "MEVCUT / SEÇİLEN ÜRÜN"
              : isMostProduced
              ? "BÖLGEDE EN ÇOK ÜRETİLEN"
              : "ALTERNATİF ÜRÜN"}
          </div>

          <h2 style={styles.cropName}>
            {strategy.name || "Ürün adı yok"}
          </h2>

          <div style={styles.cropCategory}>
            {strategy.category ||
              strategy.type ||
              "Bitkisel ürün"}
          </div>
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        </div>
      </div>

      <Metric
        label="SU TASARRUFU MİKTARI"
<<<<<<< HEAD
        value={formatWater(
          metrics.water_saved_m3_da
        )}
        progress={toProgress(
          metrics.water_saved_m3_da,
          350
        )}
        barStyle={styles.waterBar}
      />

      <Metric
        label="TAHMİNİ VERİM"
        value={estimatedYield.value}
        description={estimatedYield.description}
      />

      <Metric
        label="KAYNAK VE GİRDİ TASARRUFU"
        value={formatPercent(
          metrics.resource_saving_pct
        )}
        progress={toProgress(
          metrics.resource_saving_pct,
          40
        )}
        barStyle={styles.resourceBar}
      />

      <button
        style={styles.planButton}
        onClick={onApply}
      >
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        Planı Uygula →
      </button>
    </article>
  );
}

<<<<<<< HEAD
/*
  TAHMİNİ VERİM

  Backend'den gelen tahmini ürün verimi okunur.

  Desteklenen alanlar:

  analysis.estimated_yield_kg_da
  analysis.estimatedYieldKgDa
  impact_metrics.estimated_yield_kg_da
  impact_metrics.estimatedYieldKgDa
*/
function getEstimatedYield(analysis, metrics) {
  if (!analysis) {
    return {
      value: "Tahmini verim hesaplanamadı",
      description:
        "Bu ürün için analiz API'sinden yeterli veri alınamadı.",
    };
  }

  const rawYield =
    analysis.estimated_yield_kg_da ??
    analysis.estimatedYieldKgDa ??
    metrics.estimated_yield_kg_da ??
    metrics.estimatedYieldKgDa ??
    null;

  const numericYield = Number(rawYield);

  if (
    Number.isFinite(numericYield) &&
    numericYield > 0
  ) {
    return {
      value: `${formatNumber(
        numericYield
      )} kg / da`,
      description:
        "Tarla konumu, iklim koşulları ve ürün analiz verileri kullanılarak hesaplanan tahmini verim.",
    };
  }

  return {
    value: "Tahmini verim bulunamadı",
    description:
      "Analiz API'si bu ürün için tahmini verim değeri döndürmedi.",
  };
}

function Metric({
  label,
  value,
  description,
  progress,
  barStyle,
}) {
  return (
    <div style={styles.metricBox}>
      <div style={styles.metricLabel}>
        {label}
      </div>

      <div style={styles.metricValue}>
        {value}
      </div>

      {description && (
        <div style={styles.metricDescription}>
          {description}
        </div>
      )}

      {progress !== undefined &&
        progress !== null && (
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
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
    </div>
  );
}

function toProgress(value, max) {
<<<<<<< HEAD
  const numericValue = Number(value);
  const numericMax = Number(max);

  if (
    !Number.isFinite(numericValue) ||
    !Number.isFinite(numericMax) ||
    numericMax <= 0
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      100,
      (Math.abs(numericValue) / numericMax) * 100
    )
  );
}

function formatWater(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "API verisi bulunamadı";
  }

  return `${formatNumber(
    numericValue
  )} m³ / da`;
}

function formatPercent(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "API verisi bulunamadı";
  }

  return `%${formatNumber(
    numericValue
  )} Daha Az Girdi`;
}

function formatProduction(value) {
  const numericValue = Number(value);

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return "Veri bulunamadı";
  }

  return `${new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(numericValue)} ton`;
}

function formatNumber(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0";
  }

  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(numericValue);
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f5f7f3",
    color: "#1f2937",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    marginBottom: "24px",
  },

  kicker: {
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    color: "#4b7a55",
  },

  title: {
    margin: "6px 0",
    fontSize: "34px",
    color: "#1f2937",
  },

  meta: {
    color: "#64748b",
    fontSize: "15px",
  },

  button: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  selectedBanner: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    padding: "24px",
    borderRadius: "16px",
    background: "#163b25",
    color: "#ffffff",
    marginBottom: "22px",
  },

  bannerContent: {
    minWidth: 0,
  },

  bannerLabel: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1px",
    opacity: 0.75,
  },

  bannerTitle: {
    margin: "8px 0",
    fontSize: "28px",
    color: "#ffffff",
  },

  bannerDescription: {
    margin: 0,
    opacity: 0.85,
    lineHeight: 1.6,
  },

  productionBox: {
    minWidth: "180px",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    textAlign: "right",
  },

  productionLabel: {
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.8px",
    opacity: 0.75,
  },

  productionValue: {
    marginTop: "6px",
    fontSize: "20px",
    fontWeight: 800,
  },

  loading: {
    padding: "28px",
    background: "#ffffff",
    borderRadius: "16px",
    textAlign: "center",
    color: "#475569",
  },

  error: {
    padding: "18px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "12px",
  },

  emptyContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7f3",
    padding: "20px",
  },

  emptyCard: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "440px",
    border: "1px solid #d1d5db",
  },

  emptyTitle: {
    color: "#111827",
    margin: "0 0 10px 0",
    fontSize: "20px",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 20px 0",
    lineHeight: 1.6,
  },

  strategyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },

  strategyCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    border: "1px solid #e5e7eb",
    minHeight: "420px",
  },

  selectedCard: {
    border: "2px solid #4b7a55",
  },

  mostProducedCard: {
    boxShadow:
      "0 0 0 2px rgba(75,122,85,0.18)",
  },

  cardHeader: {
    minHeight: "74px",
  },

  cardTag: {
    fontSize: "10px",
    color: "#4b7a55",
    fontWeight: 800,
    letterSpacing: "0.8px",
    marginBottom: "6px",
  },

  cropName: {
    margin: 0,
    fontSize: "22px",
    color: "#1f2937",
  },

  cropCategory: {
    marginTop: "5px",
    color: "#64748b",
    fontSize: "13px",
  },

  metricBox: {
    padding: "14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  },

  metricLabel: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 800,
    marginBottom: "6px",
  },

  metricValue: {
    fontWeight: 800,
    fontSize: "17px",
    color: "#1f2937",
  },

  metricDescription: {
    marginTop: "7px",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  metricTrack: {
    height: "7px",
    marginTop: "12px",
    background: "#edf1ed",
    borderRadius: "999px",
    overflow: "hidden",
  },

  metricFill: {
    height: "100%",
    borderRadius: "999px",
  },

  waterBar: {
    background: "#1d8acb",
  },

  resourceBar: {
    background: "#c96b24",
  },

  planButton: {
    marginTop: "auto",
    background: "#163b25",
    color: "#ffffff",
    border: 0,
    padding: "13px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 800,
  },
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
};