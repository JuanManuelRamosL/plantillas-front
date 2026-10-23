import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "customer-auth";
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
    if (customer) localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    else localStorage.removeItem(STORAGE_KEY);
  }, [customer]);

  const loginWithEmail = async ({ name, email, phone, password, mode }) => {
    // TODO: reemplazar por fetch real:
    //   POST /api/customer/login    (mode = 'login')
    //   POST /api/customer/register (mode = 'register')
    if (!email || !password) throw new Error("Email y contraseña requeridos");
    if (mode === "register") {
      if (!name?.trim()) throw new Error("El nombre es obligatorio");
      if (!phone?.trim()) throw new Error("El teléfono es obligatorio");
    }

    const fake = {
      id: "c_" + btoa(email).slice(0, 8),
      email,
      name: mode === "register" ? name.trim() : email.split("@")[0],
      phone: mode === "register" ? phone.trim() : null,
      provider: "email",
    };
    setCustomer(fake);
    return fake;
  };

  const loginWithGoogle = async () => {
    // TODO: reemplazar por OAuth real (Google Identity Services o redirect a tu back)
    const fake = {
      id: "c_google_demo",
      email: "demo@gmail.com",
      name: "Demo Google",
      phone: null,
      provider: "google",
    };
    setCustomer(fake);
    return fake;
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
