// Mock de negocios. Cada uno tiene su slug (URL), servicios, expertos y cuenta MP vinculada.
// Cuando tengas el back, reemplazás getBusinessBySlug por un fetch.

export const BUSINESSES = {
  "proyecto-eze": {
    slug: "proyecto-eze",
    name: "Proyecto Eze",
    tagline: "Turnos de barbería",
    logo: "https://placehold.co/80x80?text=PE",
    brandColor: "#4f46e5",
    mpAccountId: "MP-ACC-PROYECTO-EZE",

    gallery: [
      "https://placehold.co/800x500?text=Local",
      "https://placehold.co/800x500?text=Barberia",
      "https://placehold.co/800x500?text=Equipo",
    ],

    location: {
      address: "Av. Corrientes 1234, CABA",
      mapEmbedUrl:
        "https://www.google.com/maps?q=Av.+Corrientes+1234,+CABA&output=embed",
    },

    courses: [
      {
        id: "c1",
        name: "Curso de barbería inicial",
        description: "Aprendé corte, fade y barba desde cero. 8 clases.",
        price: 45000,
        contactUrl: "https://wa.me/5491100000000",
      },
      {
        id: "c2",
        name: "Perfeccionamiento de fade",
        description: "Para barberos con experiencia. 4 clases intensivas.",
        price: 30000,
        contactUrl: "https://wa.me/5491100000000",
      },
    ],

    app: {
      playStoreUrl: "https://play.google.com/store/apps/details?id=com.ejemplo",
      appStoreUrl: "https://apps.apple.com/app/id000000000",
      apkUrl: "https://example.com/descargas/proyecto-eze.apk",
    },

    services: [
      // Cortes
      {
        id: "s1",
        name: "Corte clásico",
        description: "Corte con tijera y máquina, lavado incluido.",
        category: "Cortes",
        duration: 30,
        price: 8000,
        depositPercent: 30,
        requiresDeposit: true,
      },
      {
        id: "s2",
        name: "Corte + barba",
        description: "Corte completo más perfilado y arreglo de barba.",
        category: "Cortes",
        duration: 45,
        price: 12000,
        depositPercent: 30,
        requiresDeposit: true,
      },
      {
        id: "s3",
        name: "Corte fade",
        description: "Degradé prolijo con máquina y navaja.",
        category: "Cortes",
        duration: 40,
        price: 10000,
        depositPercent: 30,
        requiresDeposit: true,
      },

      // Barba
      {
        id: "s4",
        name: "Solo barba",
        description: "Perfilado y recorte de barba con toalla caliente.",
        category: "Barba",
        duration: 20,
        price: 5000,
        depositPercent: 0,
        requiresDeposit: false,
      },
      {
        id: "s5",
        name: "Afeitado clásico",
        description: "Afeitado a navaja con espuma caliente.",
        category: "Barba",
        duration: 30,
        price: 7000,
        depositPercent: 0,
        requiresDeposit: false,
      },
      {
        id: "s6",
        name: "Diseño de barba",
        description: "Perfilado artístico y definición de líneas.",
        category: "Barba",
        duration: 25,
        price: 6000,
        depositPercent: 0,
        requiresDeposit: false,
      },

      // Color
      {
        id: "s7",
        name: "Coloración",
        description: "Color completo con productos profesionales.",
        category: "Color",
        duration: 60,
        price: 15000,
        depositPercent: 30,
        requiresDeposit: true,
      },
      {
        id: "s8",
        name: "Platinado",
        description: "Decoloración y tono rubio platino.",
        category: "Color",
        duration: 90,
        price: 22000,
        depositPercent: 30,
        requiresDeposit: true,
      },
      {
        id: "s9",
        name: "Reflejos",
        description: "Mechas y reflejos personalizados.",
        category: "Color",
        duration: 75,
        price: 18000,
        depositPercent: 30,
        requiresDeposit: true,
      },
    ],

    experts: [
      {
        id: "e1",
        name: "Ezequiel",
        avatar: "https://i.pravatar.cc/150?img=12",
        bio: "Barbero con 10 años de experiencia. Especialista en fades y barba.",
        serviceIds: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"],
      },
      {
        id: "e2",
        name: "Lucía",
        avatar: "https://i.pravatar.cc/150?img=45",
        bio: "Especialista en color y cortes modernos. Atención personalizada.",
        serviceIds: ["s1", "s2", "s3", "s7", "s8", "s9"],
      },
    ],

    products: [
      {
        id: "p1",
        name: "Pomada mate",
        price: 4500,
        image: "https://placehold.co/300x300?text=Pomada",
      },
      {
        id: "p2",
        name: "Shampoo sólido",
        price: 3800,
        image: "https://placehold.co/300x300?text=Shampoo",
      },
    ],
  },

  "estudio-ana": {
    slug: "estudio-ana",
    name: "Estudio Ana",
    tagline: "Turnos de estética",
    logo: "https://placehold.co/80x80?text=EA",
    brandColor: "#db2777",
    mpAccountId: "MP-ACC-ESTUDIO-ANA",

    gallery: [
      "https://placehold.co/800x500?text=Estudio",
      "https://placehold.co/800x500?text=Manicura",
    ],

    location: {
      address: "Av. Santa Fe 2500, CABA",
      mapEmbedUrl:
        "https://www.google.com/maps?q=Av.+Santa+Fe+2500,+CABA&output=embed",
    },

    courses: [],
    app: null,

    services: [
      // Uñas
      {
        id: "s1",
        name: "Manicura",
        description: "Esmaltado semipermanente con decoración simple.",
        category: "Uñas",
        duration: 40,
        price: 7000,
        depositPercent: 50,
        requiresDeposit: true,
      },
      {
        id: "s2",
        name: "Pedicura",
        description: "Pedicura completa con exfoliación e hidratación.",
        category: "Uñas",
        duration: 50,
        price: 9000,
        depositPercent: 50,
        requiresDeposit: true,
      },
      {
        id: "s3",
        name: "Kapping gel",
        description: "Refuerzo con gel sobre uña natural.",
        category: "Uñas",
        duration: 60,
        price: 11000,
        depositPercent: 50,
        requiresDeposit: true,
      },

      // Depilación
      {
        id: "s4",
        name: "Depilación piernas",
        description: "Depilación con cera tibia. Piernas completas.",
        category: "Depilación",
        duration: 40,
        price: 8000,
        depositPercent: 0,
        requiresDeposit: false,
      },
      {
        id: "s5",
        name: "Depilación axilas",
        description: "Depilación con cera tibia. Zona axilas.",
        category: "Depilación",
        duration: 15,
        price: 3500,
        depositPercent: 0,
        requiresDeposit: false,
      },
      {
        id: "s6",
        name: "Depilación bozo",
        description: "Depilación con cera tibia. Zona bozo.",
        category: "Depilación",
        duration: 10,
        price: 2500,
        depositPercent: 0,
        requiresDeposit: false,
      },

      // Facial
      {
        id: "s7",
        name: "Limpieza facial",
        description: "Limpieza profunda con productos hipoalergénicos.",
        category: "Facial",
        duration: 50,
        price: 11000,
        depositPercent: 50,
        requiresDeposit: true,
      },
      {
        id: "s8",
        name: "Hidratación facial",
        description: "Tratamiento hidratante con ácido hialurónico.",
        category: "Facial",
        duration: 40,
        price: 9000,
        depositPercent: 50,
        requiresDeposit: true,
      },
      {
        id: "s9",
        name: "Peeling",
        description: "Exfoliación química suave. Renueva la piel.",
        category: "Facial",
        duration: 45,
        price: 13000,
        depositPercent: 50,
        requiresDeposit: true,
      },
    ],

    experts: [
      {
        id: "e1",
        name: "Ana",
        avatar: "https://i.pravatar.cc/150?img=20",
        bio: "Esteticista certificada. Especialista en uñas y faciales.",
        serviceIds: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"],
      },
      {
        id: "e2",
        name: "Camila",
        avatar: "https://i.pravatar.cc/150?img=32",
        bio: "Manicura y pedicura. Atención con turnos espaciados.",
        serviceIds: ["s1", "s2", "s3", "s4", "s5"],
      },
    ],

    products: [
      {
        id: "p1",
        name: "Esmalte",
        price: 3200,
        image: "https://placehold.co/300x300?text=Esmalte",
      },
    ],
  },
};

export function getBusinessBySlug(slug) {
  return BUSINESSES[slug] ?? null;
}

export function getService(business, serviceId) {
  return business?.services.find((s) => s.id === serviceId) ?? null;
}

export function getExpertsForService(business, serviceId) {
  return (
    business?.experts.filter((e) => e.serviceIds.includes(serviceId)) ?? []
  );
}

export function getExpert(business, expertId) {
  return business?.experts.find((e) => e.id === expertId) ?? null;
}

export function groupServicesByCategory(services) {
  const groups = new Map();
  for (const s of services) {
    const key = s.category || "Otros";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  const entries = Array.from(groups.entries());
  entries.sort(([a], [b]) => {
    if (a === "Otros") return 1;
    if (b === "Otros") return -1;
    return a.localeCompare(b);
  });
  return entries;
}
