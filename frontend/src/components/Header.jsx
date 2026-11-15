export default function Header({ user, activePage, onNavigate, onLogout }) {
  const farmName = user?.farmName || `${user?.fullName || "GAP"} Çiftliği`;

  const navButtonStyle = (pageKey) => {
    const isActive = activePage === pageKey;
    return {
      background: isActive ? "#064e3b" : "transparent",
      color: isActive ? "#ffffff" : "#374151",
      border: isActive ? "1px solid #064e3b" : "1px solid transparent",
      padding: "8px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.15s ease",
    };
  };

  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #d1d5db",
        padding: "12px 24px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 900,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Sol Taraf: Marka + Çiftlik Adı */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            onClick={() => onNavigate("dashboard")}
            style={{
              background: "#064e3b",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "17px",
              padding: "7px 13px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            GeoKernel
          </div>

          <div style={{ borderLeft: "2px solid #e5e7eb", paddingLeft: "14px" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
              {farmName}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {user?.city ? `${user.city} Havzası` : "GAP Kuru Tarım"} • {user?.fullName}
            </div>
          </div>
        </div>

        {/* Orta Kısım: Sayfa Yönlendirmeleri */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f3f4f6", padding: "4px", borderRadius: "10px" }}>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            style={navButtonStyle("dashboard")}
          >
            Tarla Paneli
          </button>

          <button
            type="button"
            onClick={() => onNavigate("strategy")}
            style={navButtonStyle("strategy")}
          >
            Ekim Stratejisi
          </button>

          <button
            type="button"
            onClick={() => onNavigate("experiences")}
            style={navButtonStyle("experiences")}
          >
            Yakındaki Deneyimler
          </button>
        </nav>

        {/* Sağ Taraf: Çıkış Yap Butonu */}
        <div>
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </header>
  );
}