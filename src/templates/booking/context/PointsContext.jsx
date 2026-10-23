import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCustomerAuth } from "../auth/CustomerAuthContext";

const PointsContext = createContext(null);

const POINTS_PER_BOOKING = 10;

function storageKey(customerId) {
  return `customer-points:${customerId}`;
}

function readPoints(customerId) {
  if (!customerId) return 0;
  try {
    const raw = localStorage.getItem(storageKey(customerId));
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function writePoints(customerId, points) {
  if (!customerId) return;
  localStorage.setItem(storageKey(customerId), String(points));
}

export function PointsProvider({ children }) {
  const { customer } = useCustomerAuth();
  const customerId = customer?.id ?? null;

  const [points, setPoints] = useState(() => readPoints(customerId));

  useEffect(() => {
    setPoints(readPoints(customerId));
  }, [customerId]);

  useEffect(() => {
    writePoints(customerId, points);
  }, [customerId, points]);

  const api = useMemo(
    () => ({
      points,
      addPoints: (amount) => setPoints((p) => p + amount),
      redeemPoints: (amount) => {
        if (points < amount) return false;
        setPoints((p) => p - amount);
        return true;
      },
      POINTS_PER_BOOKING,
    }),
    [points],
  );

  return (
    <PointsContext.Provider value={api}>{children}</PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints debe usarse dentro de PointsProvider");
  return ctx;
}
