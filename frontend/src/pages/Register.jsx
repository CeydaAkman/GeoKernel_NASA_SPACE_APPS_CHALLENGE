import { useState } from "react";
import { registerUser } from "../api";

<<<<<<< HEAD
export default function Register({
  onRegisterSuccess,
  onSwitchToLogin,
}) {
=======
export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [city, setCity] = useState("Şanlıurfa");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
=======
  const [error, setError] = useState("");
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setError("Lütfen ad soyad girin.");
      return;
    }

    if (!cleanIdentifier) {
      setError("Lütfen e-posta veya telefon numarası girin.");
      return;
    }

    if (!cleanPassword) {
      setError("Lütfen şifre girin.");
      return;
    }

    if (cleanPassword.length < 4) {
      setError("Şifre en az 4 karakter olmalıdır.");
=======
    setError("");

    if (!fullName.trim() || !identifier.trim() || !password.trim()) {
      setError("Lütfen zorunlu alanları doldurun.");
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
      return;
    }

    setLoading(true);
<<<<<<< HEAD

    try {
      const createdUser = await registerUser({
        fullName: cleanName,
        farmName: farmName.trim(),
        city: city.trim() || "Şanlıurfa",
        identifier: cleanIdentifier,
        password: cleanPassword,
      });

      if (!createdUser || !createdUser.id) {
        throw new Error("Sunucudan geçerli kullanıcı bilgisi alınamadı.");
      }

      setSuccess("Kayıt başarıyla oluşturuldu.");

      setTimeout(() => {
        onRegisterSuccess(createdUser);
      }, 500);
    } catch (err) {
      console.error("Kayıt hatası:", err);

      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.message === "Network Error") {
        setError(
          "Backend sunucusuna bağlanılamadı. Backend'in çalıştığından emin olun."
        );
      } else {
        setError(
          err?.message || "Kayıt sırasında beklenmeyen bir hata oluştu."
        );
      }
=======
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
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #d1d5db",
          padding: "28px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#064e3b",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "18px",
              padding: "6px 14px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            GeoKernel
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              color: "#111827",
            }}
          >
            Yeni Hesap Oluştur
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Çiftlik ve tarla bilgilerinizi GeoKernel'de yönetin
=======
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#ffffff", borderRadius: "14px", border: "1px solid #d1d5db", padding: "28px", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ display: "inline-block", background: "#064e3b", color: "#ffffff", fontWeight: 800, fontSize: "18px", padding: "6px 14px", borderRadius: "8px", marginBottom: "10px" }}>
            GeoKernel
          </div>
          <h1 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Yeni Hesap Oluştur</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>
            Çiftliğinizi ve parsellerinizi SQLite veritabanına kaydedin
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          </p>
        </div>

        {error && (
<<<<<<< HEAD
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              fontSize: "13px",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "14px",
            }}
          >
=======
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "13px", padding: "10px 12px", borderRadius: "8px", marginBottom: "14px" }}>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            {error}
          </div>
        )}

<<<<<<< HEAD
        {success && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              fontSize: "13px",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "14px",
            }}
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "13px",
          }}
        >
          <div>
            <label style={labelStyle}>Ad Soyad *</label>

=======
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Ad Soyad *
            </label>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            <input
              type="text"
              placeholder="Örn: Mehmet Yılmaz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
<<<<<<< HEAD
              disabled={loading}
              style={inputStyle}
=======
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            />
          </div>

          <div>
<<<<<<< HEAD
            <label style={labelStyle}>Çiftlik / İşletme Adı</label>

            <input
              type="text"
              placeholder="Örn: Yılmaz Tarım Çiftliği"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              disabled={loading}
              style={inputStyle}
=======
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Çiftlik / İşletme Adı
            </label>
            <input
              type="text"
              placeholder="Örn: Yılmaz Kuru Tarım Çiftliği"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            />
          </div>

          <div>
<<<<<<< HEAD
            <label style={labelStyle}>Şehir</label>

            <input
              type="text"
              placeholder="Örn: Şanlıurfa"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              E-posta veya Telefon Numarası *
            </label>

            <input
              type="text"
              placeholder="Örn: mehmet@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              autoComplete="username"
              style={inputStyle}
=======
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              E-posta veya Telefon Numarası *
            </label>
            <input
              type="text"
              placeholder="Örn: mehmet@ornek.com veya 0532..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            />
          </div>

          <div>
<<<<<<< HEAD
            <label style={labelStyle}>Şifre *</label>

=======
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Şifre *
            </label>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            <input
              type="password"
              placeholder="En az 4 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
              disabled={loading}
              autoComplete="new-password"
              style={inputStyle}
=======
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
            />
          </div>

          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
            style={{
              background: loading ? "#6b7280" : "#064e3b",
              color: "#ffffff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
            }}
          >
            {loading ? "Kayıt Oluşturuluyor..." : "Kayıt Ol ve Devam Et"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            color: "#4b5563",
          }}
        >
=======
            style={{ background: "#064e3b", color: "#ffffff", border: "none", padding: "11px", borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: "pointer", marginTop: "4px" }}
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol ve Devam Et"}
          </button>
        </form>

        <div style={{ marginTop: "18px", textAlign: "center", fontSize: "13px", color: "#4b5563" }}>
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          Zaten hesabınız var mı?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
<<<<<<< HEAD
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              color: "#064e3b",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
=======
            style={{ background: "none", border: "none", color: "#064e3b", fontWeight: 700, cursor: "pointer", padding: 0, textDecoration: "underline" }}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
          >
            Giriş Yapın
          </button>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "5px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  color: "#111827",
  fontSize: "14px",
  outline: "none",
};
=======
}
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
