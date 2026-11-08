import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../../../api/client";

const STORAGE_KEY = "customer-auth";
const TOKEN_KEY = "customer-token";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (customer) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [customer]);

  const loginWithEmail = async ({ name, email, phone, password, mode }) => {
    if (!email || !password) throw new Error("Email y contraseña requeridos");

    if (mode === "register") {
      if (!name?.trim()) throw new Error("El nombre es obligatorio");
      if (!phone?.trim()) throw new Error("El teléfono es obligatorio");
    }

    try {
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";

      const body =
        mode === "register" ? { name, email, password } : { email, password };

      const response = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const { token, user } = response;
      localStorage.setItem(TOKEN_KEY, token);

      const newCustomer = {
        id: user.id,
        name: user.name,
        email: user.email,
        // 👇 Guardamos el teléfono que puso en el formulario
        phone: phone || user.phone || null,
        provider: "email",
      };

      setCustomer(newCustomer);
      return newCustomer;
    } catch (error) {
      if (error.message.includes("EMAIL_TAKEN")) {
        throw new Error(
          "Este email ya está registrado. Intentá iniciar sesión.",
        );
      } else if (error.message.includes("INVALID_CREDENTIALS")) {
        throw new Error("Email o contraseña incorrectos.");
      } else if (error.message.includes("ACCOUNT_CLAIM_NOT_ALLOWED")) {
        throw new Error("Esta cuenta ya existe. Por favor, iniciá sesión.");
      } else {
        throw new Error(error.message || "Error al conectar con el servidor.");
      }
    }
  };

  const loginWithGoogle = async () => {
    throw new Error("El inicio de sesión con Google estará disponible pronto.");
  };

  const updateProfile = (partial) => {
    setCustomer((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const logout = () => setCustomer(null);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        loginWithEmail,
        loginWithGoogle,
        updateProfile,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx)
    throw new Error(
      "useCustomerAuth debe usarse dentro de CustomerAuthProvider",
    );
  return ctx;
}
