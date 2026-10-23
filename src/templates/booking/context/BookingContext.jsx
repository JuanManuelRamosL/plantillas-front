import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "booking-flow";
const BookingContext = createContext(null);

const EMPTY = {
  slug: null,
  serviceId: null,
  expertId: null,
  dateTime: null, // ISO string
  depositRequired: false,
  depositAmount: 0,
  paymentStatus: "idle", // idle | pending | paid | confirmed
};

export function BookingProvider({ slug, children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.slug === slug) return parsed;
    } catch {}
    return { ...EMPTY, slug };
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(
    () => ({
      state,
      setService: (serviceId, depositRequired, depositAmount) =>
        setState((s) => ({
          ...s,
          slug,
          serviceId,
          depositRequired,
          depositAmount,
          expertId: null,
          dateTime: null,
          paymentStatus: "idle",
        })),
      setExpert: (expertId) =>
        setState((s) => ({ ...s, expertId, dateTime: null })),
      setDateTime: (dateTime) => setState((s) => ({ ...s, dateTime })),
      setPaymentStatus: (paymentStatus) =>
        setState((s) => ({ ...s, paymentStatus })),
      reset: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setState({ ...EMPTY, slug });
      },
    }),
    [state, slug],
  );

  return (
    <BookingContext.Provider value={api}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking debe usarse dentro de BookingProvider");
  return ctx;
}
