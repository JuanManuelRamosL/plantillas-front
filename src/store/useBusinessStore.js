// src/store/useBusinessStore.js
import { create } from "zustand";
import { apiFetch } from "../api/client";

export const useBusinessStore = create((set, get) => ({
  // Estados
  business: null,
  services: [],
  experts: [],
  loading: false,
  error: null,

  // Acciones
  fetchBusinessData: async (slug) => {
    set({ loading: true, error: null });
    try {
      // 1. Traemos los datos del negocio (Branding)
      const businessData = await apiFetch(`/b/${slug}`);

      // 2. Traemos los servicios
      const servicesData = await apiFetch(`/b/${slug}/services`);

      // (Opcional) Podríamos traer todos los expertos acá,
      // pero es mejor traerlos cuando el usuario elija un servicio.

      set({
        business: businessData,
        services: servicesData,
        loading: false,
      });

      // Aplicamos la paleta de colores
      if (businessData.visual?.brandColor) {
        // Acá llamarías a tu función applyBrandPalette
        console.log("Color a aplicar:", businessData.visual.brandColor);
      }
    } catch (err) {
      set({ error: err.message, loading: false, business: null });
    }
  },

  fetchExpertsForService: async (slug, serviceId) => {
    try {
      const data = await apiFetch(`/b/${slug}/experts?serviceId=${serviceId}`);
      set({ experts: data });
    } catch (err) {
      console.error("Error cargando expertos", err);
    }
  },
}));
