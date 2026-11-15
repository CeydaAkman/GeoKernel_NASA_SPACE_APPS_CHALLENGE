import GapMap from "./GapMap";

export default function FieldMapCard({ field }) {
  if (!field) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>
          Tarla Haritası
        </h2>
        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>
          {field.lat.toFixed(4)}° K, {field.lon.toFixed(4)}° D
        </span>
      </div>

      <GapMap
        selectedCoords={{ lat: field.lat, lon: field.lon }}
        height="400px"
        interactive={false}
      />
    </div>
  );
}