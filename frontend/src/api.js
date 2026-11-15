import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function analyzeField(lat, lon, crop, name) {
  const response = await apiClient.get("/api/analyze", {
    params: { lat, lon, crop, name },
  });
  return response.data;
}

export async function loginUser(identifier, password) {
  const response = await apiClient.post("/api/auth/login", {
    identifier,
    password,
  });
  return response.data;
}

export async function registerUser(userData) {
  const response = await apiClient.post("/api/auth/register", userData);
  return response.data;
}

export async function fetchUserFields(userId) {
  const response = await apiClient.get(`/api/fields/${userId}`);
  return response.data;
}

export async function saveUserField(userId, fieldData) {
  const response = await apiClient.post("/api/fields", {
    userId,
    name: fieldData.name,
    city: fieldData.city || "",
    district: fieldData.district || "",
    lat: fieldData.lat,
    lon: fieldData.lon,
    crop: fieldData.crop || "Makarnalık Buğday",
  });
  return response.data;
}

export async function savePlan(planData) {
  const response = await apiClient.post("/api/plans", planData);
  return response.data;
}

export async function fetchFieldPlans(fieldId, userId) {
  const response = await apiClient.get(
    `/api/fields/${fieldId}/plans/${userId}`
  );
  return response.data;
}

export async function getTopCropsByCity(city) {
  const response = await apiClient.get(
    "/api/crops/top-by-city",
    {
      params: { city },
    }
  );

  return response.data;
}

export async function getCropProfile(crop) {
  const response = await apiClient.get("/api/crops/profile", {
    params: { crop },
  });
  return response.data;
}

export async function getStrategyCrops(city, crop = "") {
  const response = await apiClient.get("/api/strategy", {
    params: { city, crop },
  });
  return response.data;
}
