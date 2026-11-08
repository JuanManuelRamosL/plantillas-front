import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useBookingStore = create(
  persist(
    (set) => ({
      // Estado del flujo de reserva
      service: null, // { id, name, price, duration }
      expert: null, // { id, name }
      date: null, // ISO String
      time: null, // String "HH:mm"

      // Acciones
      setService: (service) =>
        set({ service, expert: null, date: null, time: null }),
      setExpert: (expert) => set({ expert }),
      setDateTime: (date, time) => set({ date, time }),

      // Limpiar todo al terminar o salir
      clearBooking: () =>
        set({ service: null, expert: null, date: null, time: null }),
    }),
    {
      name: "booking-flow", // Nombre de la clave en el storage
      storage: createJSONStorage(() => sessionStorage), // Usamos sessionStorage para que se limpie al cerrar la pestaña
    },
  ),
);
