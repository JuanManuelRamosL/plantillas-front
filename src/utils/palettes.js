// src/utils/palettes.js
// Esto es una copia exacta de las paletas del backend
export const PALETTES = [
  {
    key: "gold",
    name: "Dorado",
    primary: "#c9a200",
    primaryStrong: "#c0a439",
    accent: "#f4e9c1",
  },
  {
    key: "rose",
    name: "Rosa",
    primary: "#d16d8a",
    primaryStrong: "#b8506f",
    accent: "#f9dde5",
  },
  {
    key: "black",
    name: "Negro",
    primary: "#1f1f1f",
    primaryStrong: "#000000",
    accent: "#e5e5e5",
  },
  {
    key: "blue",
    name: "Azul",
    primary: "#2f6fd6",
    primaryStrong: "#1f55ad",
    accent: "#dce8fb",
  },
  {
    key: "green",
    name: "Verde",
    primary: "#2e9b6b",
    primaryStrong: "#227a53",
    accent: "#d8f1e5",
  },
  {
    key: "purple",
    name: "Violeta",
    primary: "#7b4fd1",
    primaryStrong: "#5f37ad",
    accent: "#e8defa",
  },
  {
    key: "white",
    name: "Blanco",
    primary: "#374151",
    primaryStrong: "#1f2937",
    accent: "#f3f4f6",
  },
  {
    key: "cream",
    name: "Crema",
    primary: "#9a7b4f",
    primaryStrong: "#7d6240",
    accent: "#f3ead9",
  },
  {
    key: "stone",
    name: "Piedra",
    primary: "#57534e",
    primaryStrong: "#44403c",
    accent: "#e7e5e4",
  },
  {
    key: "slate",
    name: "Pizarra",
    primary: "#334155",
    primaryStrong: "#1e293b",
    accent: "#e2e8f0",
  },
  {
    key: "navy",
    name: "Azul marino",
    primary: "#1e3a5f",
    primaryStrong: "#0f2742",
    accent: "#dbe4f0",
  },
];

export function applyBrandPalette(paletteKey) {
  const palette = PALETTES.find((p) => p.key === paletteKey) || PALETTES[0]; // Por defecto 'gold'

  // Inyectamos las variables CSS en el root del documento
  document.documentElement.style.setProperty("--brand", palette.primary);
  document.documentElement.style.setProperty(
    "--brand-strong",
    palette.primaryStrong,
  );
  document.documentElement.style.setProperty("--brand-accent", palette.accent);
}
