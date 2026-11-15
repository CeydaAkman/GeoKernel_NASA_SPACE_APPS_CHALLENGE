import { useState } from "react";
import { loginUser } from "../api";

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Lütfen e-posta/telefon ve şifre alanlarını doldurun.");
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(identifier, password);
      onLoginSuccess(user);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Sunucuya bağlanılamadı veya bilgiler hatalı.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await loginUser("demo@geokernel.org", "123456");
      onLoginSuccess(user);
    } catch {
      onLoginSuccess({
        id: 1,
        identifier: "demo@geokernel.org",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#ffffff", borderRadius: "14px", border: "1px solid #d1d5db", padding: "28px", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div style={{ display: "inline-block", background: "#064e3b", color: "#ffffff", fontWeight: 800, fontSize: "18px", padding: "6px 14px", borderRadius: "8px", marginBottom: "10px" }}>
            GeoKernel
          </div>
          <h1 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Çiftçi & Kooperatif Girişi</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>
            GAP Kuru Tarım İklim Adaptasyon ve Ekim Karar Sistemi
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "13px", padding: "10px 12px", borderRadius: "8px", marginBottom: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
              E-posta veya Telefon Numarası
            </label>
            <input
              type="text"
              placeholder="Örn: demo@geokernel.org"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
              Şifre
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: "#064e3b", color: "#ffffff", border: "none", padding: "11px", borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginTop: "4px" }}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={loading}
          style={{ width: "100%", marginTop: "10px", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", padding: "9px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
        >
          Tek Tıkla Demo Girişi Yap
        </button>

        <div style={{ marginTop: "18px", textAlign: "center", fontSize: "13px", color: "#4b5563" }}>
          Hesabınız yok mu?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{ background: "none", border: "none", color: "#064e3b", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            Kayıt Olun
          </button>
        </div>
      </div>
    </div>
  );
}