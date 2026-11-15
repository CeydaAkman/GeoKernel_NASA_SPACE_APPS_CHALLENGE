export default function FarmerSmsPreview({ smsText, locationName }) {
  if (!smsText) return null;

  return (
    <div style={{
      background: "#111827",
      color: "#f9fafb",
      borderRadius: "20px",
      padding: "16px",
      border: "3px solid #374151",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    }}>
      <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
        <span>TARSİM / Kooperatif SMS Bildirimi</span>
        <span>Şimdi</span>
      </div>
      <div style={{
        background: "#065f46",
        color: "#ecfdf5",
        padding: "12px 14px",
        borderRadius: "14px 14px 14px 4px",
        fontSize: "14px",
        lineHeight: "1.45"
      }}>
        <strong>{locationName}</strong>
        <p style={{ margin: "6px 0 0 0" }}>{smsText}</p>
      </div>
    </div>
  );
}