export default function Navbar({ fields, selectedFieldId, onSelectField, onOpenAddModal }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "14px",
        padding: "16px 20px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#374151" }}>
          Kayıtlı Tarlalarım:
        </span>
        <select
          value={selectedFieldId}
          onChange={(e) => onSelectField(e.target.value)}
          style={{
            padding: "9px 14px",
            borderRadius: "9px",
            border: "1px solid #d1d5db",
            backgroundColor: "#f9fafb",
            color: "#111827",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            minWidth: "300px",
          }}
        >
          {fields.map((field) => (
            <option key={field.id} value={field.id} style={{ color: "#111827", backgroundColor: "#ffffff" }}>
              {field.name} ({field.lat.toFixed(2)}, {field.lon.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        style={{
          background: "#064e3b",
          color: "#ffffff",
          border: "none",
          padding: "10px 18px",
          borderRadius: "9px",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        + Tarla Ekle
      </button>
    </div>
  );
}