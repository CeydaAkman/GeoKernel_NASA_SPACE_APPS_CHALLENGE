export default function DecisionCards({ data }) {
  if (!data) return null;

  const isHighRisk = data.risk_score >= 70;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
      <div style={{
        background: isHighRisk ? "#fef2f2" : "#f0fdf4",
        border: `1px solid ${isHighRisk ? "#fecaca" : "#bbf7d0"}`,
        borderRadius: "12px",
        padding: "18px"
      }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>
          İklim & Kuraklık Risk Skoru
        </span>
        <div style={{ fontSize: "34px", fontWeight: 800, color: isHighRisk ? "#dc2626" : "#16a34a", margin: "6px 0" }}>
          {data.risk_score} / 100
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: "#374151" }}>{data.climate_analogue}</p>
      </div>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px"
      }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>
          Dinamik Ekim Takvimi ({data.sowing_window.shift_days})
        </span>
        <div style={{ margin: "8px 0", fontSize: "13px", color: "#9ca3af", textDecoration: "line-through" }}>
          Geleneksel: {data.sowing_window.traditional}
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#047857" }}>
          Önerilen: {data.sowing_window.recommended}
        </div>
        <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#4b5563" }}>
<<<<<<< HEAD
          NASA POWER kök bölgesi nem eşiğine göre güncellendi.
=======
          SMAP kök bölgesi nem eşiğine göre güncellendi.
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        </p>
      </div>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px"
      }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>
          Ürün Adaptasyon Önerisi
        </span>
        <div style={{ margin: "8px 0 4px 0", fontSize: "14px", fontWeight: 600, color: "#b45309" }}>
          {data.crop_advice.status}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
          {data.crop_advice.recommended_crop}
        </div>
        <div style={{ marginTop: "6px", fontSize: "12px", fontWeight: 600, color: "#059669" }}>
          {data.crop_advice.expected_loss_prevented}
        </div>
      </div>
    </div>
  );
}