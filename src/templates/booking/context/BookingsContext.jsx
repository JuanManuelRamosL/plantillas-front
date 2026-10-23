import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCustomerAuth } from "../auth/CustomerAuthContext";

const BookingsContext = createContext(null);

// TODO: cuando integres el back, este contexto pasa a hacer:
//   GET  /api/customer/bookings
//   POST /api/bookings
// y deja de usar localStorage.

function storageKey(customerId) {
  return `customer-bookings:${customerId}`;
}

function readBookings(customerId) {
  if (!customerId) return [];
  try {
    const raw = localStorage.getItem(storageKey(customerId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeBookings(customerId, bookings) {
  if (!customerId) return;
  localStorage.setItem(storageKey(customerId), JSON.stringify(bookings));
}

export function BookingsProvider({ children }) {
  const { customer } = useCustomerAuth();
  const customerId = customer?.id ?? null;

  const [bookings, setBookings] = useState(() => readBookings(customerId));

  useEffect(() => {
    setBookings(readBookings(customerId));
  }, [customerId]);

  useEffect(() => {
    writeBookings(customerId, bookings);
  }, [customerId, bookings]);

  const api = useMemo(
    () => ({
      bookings,
      addBooking: (booking) => {
        setBookings((prev) => [booking, ...prev]);
        return booking;
      },
      updateBookingStatus: (id, status) =>
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b)),
        ),
      getBooking: (id) => bookings.find((b) => b.id === id) ?? null,
      clearBookings: () => setBookings([]),
    }),
    [bookings],
  );

  return (
    <BookingsContext.Provider value={api}>{children}</BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx)
    throw new Error("useBookings debe usarse dentro de BookingsProvider");
  return ctx;
}
