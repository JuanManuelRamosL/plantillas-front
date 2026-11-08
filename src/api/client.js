const BASE_URL =
  import.meta.env.VITE_API_URL || "https://negocioreservas.vercel.app";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("customer-token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // 👇 LÓGICA CLAVE: Si el endpoint es de auth, no le agregamos el /api
  const isAuthRoute = path.startsWith("/auth");
  const apiPrefix = isAuthRoute ? "" : "/api";

  const fullUrl = `${BASE_URL}${apiPrefix}${path}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "Error en la petición";
    try {
      const errorData = await response.json();
      console.log(`[API Error ${response.status}]`, errorData);
      // El backend anida los errores en errorData.error.message
      errorMessage =
        errorData.error?.message || errorData.message || errorMessage;
    } catch (e) {
      console.log(`[API Error ${response.status}] Respuesta no es JSON válida`);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
