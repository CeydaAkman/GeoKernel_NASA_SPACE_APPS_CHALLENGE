import { useEffect, useState } from "react";
import {
  analyzeField,
  fetchUserFields,
  saveUserField,
  fetchFieldPlans,
} from "../api";
import AddFieldModal from "../components/AddFieldModal";
import FieldDetailsCard from "../components/FieldDetailsCard";
import FieldMapCard from "../components/FieldMapCard";
import Navbar from "../components/Navbar";
import WeatherCard from "../components/WeatherCard";

const SELECTED_FIELD_KEY = "geokernel_selected_field_v1";
const HISTORY_STORAGE_KEY = "geokernel_completed_plans_v1";

export default function Dashboard({ user, onSyncActiveData }) {
  // Başlangıçta liste boş (Yeni kullanıcılar için hazır tarla yok)
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(() => sessionStorage.getItem(SELECTED_FIELD_KEY) || "");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  // Aktif tarla (Eğer liste boşsa null döner)
  const activeField = fields.find((f) => String(f.id) === String(selectedFieldId)) || fields[0] || null;

  // Kullanıcıya ait tarlaları API'den çek
  useEffect(() => {
    if (!user?.id) return;
    let active = true;

    fetchUserFields(user.id)
      .then((dbFields) => {
        if (active && Array.isArray(dbFields) && dbFields.length > 0) {
          setFields(dbFields);
          const exists = dbFields.some((f) => String(f.id) === String(selectedFieldId));
          if (!exists) {
            setSelectedFieldId(String(dbFields[0].id));
          }
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [user?.id]);

  // Geçmiş planları getir
  useEffect(() => {
    if (!activeField?.id) {
      setHistory([]);
      return;
    }

    let active = true;
    setHistoryLoading(true);

    const getLocalPlans = () => {
      try {
        const allLocal = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
        return allLocal.filter((p) => String(p.fieldId) === String(activeField.id));
      } catch {
        return [];
      }
    };

    const localPlans = getLocalPlans();

    if (!user?.id) {
      setHistory(localPlans);
      setHistoryLoading(false);
      return;
    }

    fetchFieldPlans(activeField.id, user.id)
      .then((data) => {
        if (active) {
          const apiPlans = Array.isArray(data) ? data : [];
          const apiIds = new Set(apiPlans.map((p) => String(p.id)));
          const uniqueLocal = localPlans.filter((p) => !apiIds.has(String(p.id)));
          setHistory([...uniqueLocal, ...apiPlans]);
        }
      })
      .catch((error) => {
        console.error("Plan geçmişi API'den alınamadı, yerel kayıtlar gösteriliyor:", error);
        if (active) setHistory(localPlans);
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeField?.id, user?.id]);

  useEffect(() => {
    if (selectedFieldId) {
      sessionStorage.setItem(SELECTED_FIELD_KEY, String(selectedFieldId));
    }
  }, [selectedFieldId]);

  // Aktif tarla değiştiğinde analiz verilerini çek
  useEffect(() => {
    if (!activeField) {
      setAnalysis(null);
      return;
    }
    let active = true;
    setLoading(true);

    analyzeField(activeField.lat, activeField.lon, activeField.crop, activeField.name)
      .then((res) => {
        if (active) {
          setAnalysis(res);
          if (onSyncActiveData) {
            onSyncActiveData(activeField, res);
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeField, onSyncActiveData]);

  // Yeni tarla eklendiğinde state'e kaydet ve aktif yap
  const handleSaveNewField = async (draftField) => {
    try {
      const savedField = await saveUserField(user?.id || 1, draftField);
      setFields((prev) => [savedField, ...prev]);
      setSelectedFieldId(String(savedField.id));
    } catch {
      const localNewField = { ...draftField, id: Date.now() };
      setFields((prev) => [localNewField, ...prev]);
      setSelectedFieldId(String(localNewField.id));
    }
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
      {/* Üst Bar: Kayıtlı Tarlalar Seçicisi ve Tarla Ekle Butonu */}
      <Navbar
        fields={fields}
        selectedFieldId={selectedFieldId}
        onSelectField={(val) => setSelectedFieldId(String(val))}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Eğer hiç tarla yoksa boş durum (Empty State) göster */}
      {!activeField ? (
        <div style={styles.emptyWelcomeCard}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌾</div>
          <h2 style={{ color: "#064e3b", margin: "0 0 8px" }}>Henüz Kayıtlı Bir Tarlanız Bulunmuyor</h2>
          <p style={{ color: "#6b7280", maxWidth: "500px", margin: "0 auto 20px", fontSize: "14px" }}>
            Sistemi kullanmaya başlamak ve iklim, toprak, rekolte analizlerini görüntülemek için ilk taryanızı ekleyin.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={styles.primaryAddButton}
          >
            + Hemen İlk Tarlanızı Ekleyin
          </button>
        </div>
      ) : (
        <>
          {/* 3 Sütunlu Yan Yana Düzen: Harita | Fiziksel Özellikler | Dikey Hava Durumu */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.15fr 1fr",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {/* 1. Sütun: Tarla Haritası */}
            <div>
              <FieldMapCard field={activeField} />
            </div>

            {/* 2. Sütun: Tarla Fiziksel Özellikleri */}
            <div>
              <FieldDetailsCard
                field={activeField}
                analysis={analysis}
                loading={loading}
              />
            </div>

            {/* 3. Sütun: Dikey 5 Günlük Hava Durumu */}
            <div>
              <WeatherCard key={activeField?.id} field={activeField} />
            </div>
          </div>

          {/* GEÇMİŞ PLAN KAYITLARI */}
          <div
            style={{
              marginTop: "28px",
              background: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: "14px",
              padding: "22px",
            }}
          >
            <h2 style={{ color: "#064e3b", marginTop: 0 }}>
              📚 Geçmiş Plan Kayıtları
            </h2>

            <p style={{ color: "#6b7280", fontSize: "13px" }}>
              {activeField?.name} için tamamlanan sezonluk planlar ve sonuçları.
            </p>

            {historyLoading ? (
              <p>Geçmiş kayıtlar yükleniyor...</p>
            ) : history.length === 0 ? (
              <div
                style={{
                  background: "#f9fafb",
                  padding: "20px",
                  borderRadius: "10px",
                  color: "#6b7280",
                }}
              >
                Bu tarlaya ait henüz kayıtlı bir plan bulunmuyor. Bir sezonluk planı tamamladığınızda kayıtlarınız burada görünecek.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "14px" }}>
                {history.map((plan) => (
                  <div
                    key={plan.id}
                    style={{
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <h3 style={{ margin: "0 0 6px", color: "#064e3b" }}>
                          {plan.crop}
                        </h3>

                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          Kayıt tarihi:{" "}
                          {plan.createdAt
                            ? new Date(plan.createdAt).toLocaleDateString("tr-TR")
                            : "-"}
                        </div>

                        <div style={{ marginTop: "8px", fontSize: "14px" }}>
                          <strong>Gerçekleşen verim:</strong>{" "}
                          {plan.yieldValue} {plan.yieldUnit}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedPlanId(
                            expandedPlanId === plan.id ? null : plan.id
                          )
                        }
                        style={{
                          background: "#064e3b",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        {expandedPlanId === plan.id
                          ? "Detayları Gizle"
                          : "Detayları Gör"}
                      </button>
                    </div>

                    {expandedPlanId === plan.id && (
                      <div
                        style={{
                          marginTop: "18px",
                          paddingTop: "16px",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <h4>Uygulama İşlemleri</h4>

                        {(plan.operations || []).map((op, index) => {
                          const status = plan.statuses?.[index];

                          return (
                            <div
                              key={index}
                              style={{
                                background: "#f9fafb",
                                padding: "12px",
                                borderRadius: "8px",
                                marginBottom: "8px",
                              }}
                            >
                              <strong>{op.title}</strong>

                              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                                - {op.category} | {op.window}
                              </div>

                              {op.detail && (
                                <div style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px" }}>
                                  {op.detail}
                                </div>
                              )}

                              <div
                                style={{
                                  marginTop: "6px",
                                  fontWeight: 700,
                                  color:
                                    status === "applied"
                                      ? "#047857"
                                      : "#b91c1c",
                                }}
                              >
                                {status === "applied"
                                  ? "✓ Uygulandı"
                                  : "✕ Uygulanmadı"}
                              </div>
                            </div>
                          );
                        })}

                        <h4>Sezon Sonu Değerlendirmesi</h4>

                        <p>
                          <strong>Genel başarı: </strong>
                          {{
                            very_good: "Çok başarılı",
                            good: "Başarılı",
                            average: "Orta",
                            poor: "Beklediğim gibi olmadı",
                          }[plan.rating] || plan.rating}
                        </p>

                        <p>
                          <strong>Gerçekleşen verim: </strong>
                          {plan.yieldValue} {plan.yieldUnit}
                        </p>

                        <p>
                          <strong>Çiftçi gözlemleri:</strong>
                        </p>

                        <div
                          style={{
                            background: "#f0fdf4",
                            padding: "14px",
                            borderRadius: "8px",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {plan.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <AddFieldModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveField={handleSaveNewField}
      />
    </div>
  );
}

const styles = {
  emptyWelcomeCard: {
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "16px",
    padding: "60px 20px",
    textAlign: "center",
    marginTop: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  primaryAddButton: {
    background: "#064e3b",
    color: "#ffffff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(6, 78, 59, 0.2)",
  },
};