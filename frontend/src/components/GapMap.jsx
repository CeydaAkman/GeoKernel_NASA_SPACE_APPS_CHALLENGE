import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";

function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
<<<<<<< HEAD
      map.setView([coords.lat, coords.lon], 9);
=======
      map.setView([coords.lat, coords.lon], 13);
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
    }
  }, [coords, map]);
  return null;
}

function MapClickHandler({ onSelectCoords }) {
  useMapEvents({
    click(e) {
      if (onSelectCoords) {
        onSelectCoords(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function GapMap({ selectedCoords, onSelectCoords, height = "420px", interactive = true }) {
<<<<<<< HEAD
  const defaultCenter = [38.9637, 35.2433];
  const center = selectedCoords ? [selectedCoords.lat, selectedCoords.lon] : defaultCenter;
  const zoomLevel = selectedCoords ? 9 : 6;

  return (
    <div style={{ height, width: "100%", borderRadius: "10px", overflow: "hidden", border: "1px solid #d1d5db" }}>
      <MapContainer center={center} zoom={zoomLevel} maxZoom={9} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg"
          attribution="NASA Global Imagery Browse Services (GIBS)"
          maxNativeZoom={8}
=======
  // Eğer seçili tarla yoksa Türkiye geneli varsayılan merkez (Örn: Güneydoğu Anadolu veya Türkiye merkezi)
  const defaultCenter = [38.9637, 35.2433]; // Türkiye merkezi
  const center = selectedCoords ? [selectedCoords.lat, selectedCoords.lon] : defaultCenter;
  const zoomLevel = selectedCoords ? 13 : 6;

  return (
    <div style={{ height, width: "100%", borderRadius: "10px", overflow: "hidden", border: "1px solid #d1d5db" }}>
      <MapContainer center={center} zoom={zoomLevel} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Esri & NASA Earthdata"
>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        />
        <MapRecenter coords={selectedCoords} />
        {interactive && <MapClickHandler onSelectCoords={onSelectCoords} />}

<<<<<<< HEAD
=======
        {/* Pilot tarlalar kaldırıldı, harita ilk girişte tamamen temiz ve tarlaya özel açılır */}

>>>>>>> d270ed024f92099877e93a23c188ff36246eb522
        {selectedCoords && (
          <CircleMarker
            center={[selectedCoords.lat, selectedCoords.lon]}
            radius={11}
            pathOptions={{ color: "#ef4444", fillColor: "#dc2626", fillOpacity: 0.95 }}
          >
            <Popup>
              Seçili Tarla ({selectedCoords.lat.toFixed(4)}, {selectedCoords.lon.toFixed(4)})
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}