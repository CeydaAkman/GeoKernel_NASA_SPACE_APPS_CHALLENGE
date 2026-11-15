import { useState } from "react";
import GapMap from "./GapMap";

const GAP_LOCATIONS = {
  Şanlıurfa: [
    { name: "Viranşehir", lat: 37.234, lon: 39.762 },
    { name: "Harran", lat: 36.863, lon: 39.031 },
    { name: "Siverek", lat: 37.755, lon: 39.317 },
    { name: "Ceylanpınar", lat: 36.847, lon: 40.050 },
    { name: "Akçakale", lat: 36.711, lon: 38.948 },
    { name: "Suruç", lat: 36.976, lon: 38.423 },
    { name: "Hilvan", lat: 37.587, lon: 38.955 },
    { name: "Bozova", lat: 37.363, lon: 38.526 },
    { name: "Eyyübiye (Merkez)", lat: 37.121, lon: 38.803 },
  ],
  Mardin: [
    { name: "Kızıltepe", lat: 37.186, lon: 40.586 },
    { name: "Nusaybin", lat: 37.075, lon: 41.215 },
    { name: "Derik", lat: 37.364, lon: 40.269 },
    { name: "Artuklu (Merkez)", lat: 37.313, lon: 40.735 },
    { name: "Mazıdağı", lat: 37.476, lon: 40.487 },
    { name: "Midyat", lat: 37.419, lon: 41.339 },
  ],
  Diyarbakır: [
    { name: "Bismil", lat: 37.846, lon: 40.666 },
    { name: "Çınar", lat: 37.724, lon: 40.413 },
    { name: "Silvan", lat: 38.138, lon: 41.008 },
    { name: "Ergani", lat: 38.268, lon: 39.761 },
    { name: "Sur (Merkez)", lat: 37.914, lon: 40.236 },
<<<<<<< HEAD
  ]
=======
  ],
  Gaziantep: [
    { name: "Nizip", lat: 37.010, lon: 37.794 },
    { name: "Oğuzeli", lat: 36.966, lon: 37.510 },
    { name: "Araban", lat: 37.425, lon: 37.689 },
    { name: "Yavuzeli", lat: 37.319, lon: 37.569 },
  ],
  Batman: [
    { name: "Merkez", lat: 37.887, lon: 41.132 },
    { name: "Beşiri", lat: 37.919, lon: 41.293 },
    { name: "Kozluk", lat: 38.193, lon: 41.488 },
  ],
  Adıyaman: [
    { name: "Kahta", lat: 37.781, lon: 38.622 },
    { name: "Besni", lat: 37.693, lon: 37.861 },
    { name: "Merkez", lat: 37.764, lon: 38.278 },
  ],
  Siirt: [
    { name: "Kurtalan", lat: 37.926, lon: 41.698 },
    { name: "Merkez", lat: 37.933, lon: 41.950 },
  ],
  Şırnak: [
    { name: "Cizre", lat: 37.331, lon: 42.185 },
    { name: "Silopi", lat: 37.249, lon: 42.470 },
    { name: "İdil", lat: 37.339, lon: 41.889 },
  ],
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
};

export default function AddFieldModal({ isOpen, onClose, onSaveField }) {
  const [selectedCity, setSelectedCity] = useState("Şanlıurfa");
  const [selectedDistrict, setSelectedDistrict] = useState("Viranşehir");
  const [coords, setCoords] = useState({ lat: 37.234, lon: 39.762 });
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const districts = GAP_LOCATIONS[selectedCity] || [];

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    const cityDistricts = GAP_LOCATIONS[newCity] || [];
    const firstDistrict = cityDistricts[0];

    setSelectedCity(newCity);
    if (firstDistrict) {
      setSelectedDistrict(firstDistrict.name);
      setCoords({ lat: firstDistrict.lat, lon: firstDistrict.lon });
    }
  };

  const handleDistrictChange = (e) => {
    const newDistrictName = e.target.value;
    setSelectedDistrict(newDistrictName);
    const found = districts.find((d) => d.name === newDistrictName);
    if (found) {
      setCoords({ lat: found.lat, lon: found.lon });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName =
      name.trim() || `${selectedDistrict} Parseli (${selectedCity})`;

    onSaveField({
      id: `field-${Date.now()}`,
      name: cleanName,
      city: selectedCity,
      district: selectedDistrict,
      lat: Number(coords.lat.toFixed(4)),
      lon: Number(coords.lon.toFixed(4)),
    });

    setName("");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17, 24, 39, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "740px",
          padding: "22px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* Başlık */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>Haritadan Yeni Tarla Seç</h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#6b7280" }}>
              Önce şehir ve ilçe seçerek bölgeye odaklanın, ardından haritada tarlanıza tıklayın.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              color: "#111827",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Şehir ve İlçe Seçicileri (Haritayı Otomatik Odaklar) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Şehir
            </label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                color: "#111827",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {Object.keys(GAP_LOCATIONS).map((city) => (
                <option key={city} value={city} style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              İlçe
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                color: "#111827",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {districts.map((dist) => (
                <option key={dist.name} value={dist.name} style={{ color: "#111827", backgroundColor: "#ffffff" }}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Uydu Haritası */}
        <GapMap
          selectedCoords={coords}
          onSelectCoords={(lat, lon) => setCoords({ lat, lon })}
          height="320px"
          interactive={true}
        />

        {/* Tarla Adı ve Kaydet Butonu (Ürün Alanı Kaldırıldı) */}
        <form
          onSubmit={handleSubmit}
          style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "end" }}
        >
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Tarla Adı ({selectedCity} / {selectedDistrict} — {coords.lat.toFixed(3)}, {coords.lon.toFixed(3)})
            </label>
            <input
              type="text"
              placeholder={`Örn: ${selectedDistrict} Güney Tarlası`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                color: "#111827",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#064e3b",
              color: "#ffffff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Tarlayı Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}