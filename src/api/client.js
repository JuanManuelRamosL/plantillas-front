// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL || "https://negocioreservas.vercel.app";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("customer-token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}/api${path}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "Error en la petición";
    try {
      const errorData = await response.json();
      console.log(`[API Error ${response.status}]`, errorData);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      console.log(`[API Error ${response.status}] Respuesta no es JSON válida`);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
