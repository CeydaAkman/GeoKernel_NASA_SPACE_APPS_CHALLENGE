import { useState } from "react";
import { registerUser } from "../api";

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !identifier.trim() || !password.trim()) {
      setError("Lütfen zorunlu alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      const createdUser = await registerUser({
        fullName,
        farmName,
        identifier,
        password,
      });
      onRegisterSuccess(createdUser);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Kayıt sırasında bir hata oluştu.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#ffffff", borderRadius: "14px", border: "1px solid #d1d5db", padding: "28px", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ display: "inline-block", background: "#064e3b", color: "#ffffff", fontWeight: 800, fontSize: "18px", padding: "6px 14px", borderRadius: "8px", marginBottom: "10px" }}>
            GeoKernel
          </div>
          <h1 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Yeni Hesap Oluştur</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>
            Çiftliğinizi ve parsellerinizi SQLite veritabanına kaydedin
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "13px", padding: "10px 12px", borderRadius: "8px", marginBottom: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Ad Soyad *
            </label>
            <input
              type="text"
              placeholder="Örn: Mehmet Yılmaz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Çiftlik / İşletme Adı
            </label>
            <input
              type="text"
              placeholder="Örn: Yılmaz Kuru Tarım Çiftliği"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              E-posta veya Telefon Numarası *
            </label>
            <input
              type="text"
              placeholder="Örn: mehmet@ornek.com veya 0532..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Şifre *
            </label>
            <input
              type="password"
              placeholder="En az 4 karakter"
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
            {loading ? "Kaydediliyor..." : "Kayıt Ol ve Devam Et"}
          </button>
        </form>

        <div style={{ marginTop: "18px", textAlign: "center", fontSize: "13px", color: "#4b5563" }}>
          Zaten hesabınız var mı?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{ background: "none", border: "none", color: "#064e3b", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            Giriş Yapın
          </button>
        </div>
      </div>
    </div>
  );
}