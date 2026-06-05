// GoalWear Master Product Database
// This file is designed for easy customization and editing directly on GitHub.

export const products = [
  {
    id: "arg-home-2026",
    name: "Argentina 2026 WORLD CUP Home Jersey",
    category: "National Teams",
    price: 450,
    originalPrice: 500,
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    image: "https://easydrop.asia/products/image-1777809771695-280330173.jpeg", // Fallback thumbnail
    description: "The official Argentina 2026 WORLD CUP Home Jersey. Emblazoned with three gold stars honoring their World Cup victories. Crafted with ultra-breathable, moisture-wicking technology to keep you cool and dry on the pitch or in the stands.",
    sizes: ["M", "L", "XL", "XXL"],
    specs: {
      Material: "100% Recycled Polyester Doubleknit",
      Fit: "Slim fit",
      Technology: "AEROREADY fabric absorption",
      Crest: "Heat-applied Argentina crest with 3 stars",
      Details: "Ribbed crewneck and gold branding elements"
    },
    design: {
      primaryColor: "#74acdf",      // Sky blue
      secondaryColor: "#ffffff",    // White
      stripeType: "vertical",       // Stripes pattern
      stripeColor: "#ffffff",
      sponsorText: "A F A",
      numberText: "10",
      collarColor: "#ffffff",
      badgeColor: "#e5c158"         // Gold crest
    },
    reviews: [
      { id: 1, user: "Sakib A.", rating: 5, comment: "Amazing quality, the gold details look absolutely premium!", date: "2026-05-15" },
      { id: 2, user: "Tanvir H.", rating: 5, comment: "Fits perfectly. The 3D viewer on this site is spot on to the actual product.", date: "2026-05-20" }
    ]
  },
  {
    id: "rm-home-24",
    name: "Real Madrid 24/25 Home Jersey",
    category: "Club Teams",
    price: 4200,
    originalPrice: 4800,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=400",
    description: "Real Madrid 2024/25 official home shirt. Features a clean, minimalistic white design with premium houndstooth pattern texturing and gold stripes highlighting the royal club's dominance.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    specs: {
      Material: "100% Polyester Mock Eyelet",
      Fit: "Athletic/Player fit",
      Technology: "HEAT.RDY air circulation",
      Crest: "Embroidered Real Madrid crest",
      Details: "Custom script print on back collar"
    },
    design: {
      primaryColor: "#ffffff",      // White
      secondaryColor: "#e5c158",    // Gold
      stripeType: "solid",
      sponsorText: "Fly Emirates",
      numberText: "7",
      collarColor: "#e5c158",
      badgeColor: "#e5c158"
    },
    reviews: [
      { id: 1, user: "Imran K.", rating: 5, comment: "Pure elegance. The white and gold is a masterpiece.", date: "2026-05-18" }
    ]
  },
  {
    id: "barca-home-24",
    name: "FC Barcelona 24/25 Home Jersey",
    category: "Club Teams",
    price: 4150,
    originalPrice: 4700,
    isNew: true,
    isBestSeller: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400",
    description: "The FC Barcelona 24/25 season home jersey celebrates the club's 125th anniversary. A classic vertical split pattern returning to the iconic blaugrana colors with gold details.",
    sizes: ["M", "L", "XL"],
    specs: {
      Material: "100% Recycled Polyester",
      Fit: "Slim fit",
      Technology: "Dri-FIT ADV ventilation",
      Crest: "Centric placed club badge",
      Details: "125 Anys commemorative signature on inner collar"
    },
    design: {
      primaryColor: "#004d98",      // Blue
      secondaryColor: "#a50044",    // Maroon
      stripeType: "vertical",
      stripeColor: "#a50044",
      sponsorText: "Spotify",
      numberText: "9",
      collarColor: "#004d98",
      badgeColor: "#edbb00"
    },
    reviews: [
      { id: 1, user: "Rifat F.", rating: 4, comment: "Anniversary crest in the center looks legendary.", date: "2026-05-22" }
    ]
  },
  {
    id: "manc-home-24",
    name: "Manchester City 24/25 Home Jersey",
    category: "Club Teams",
    price: 3950,
    originalPrice: 4500,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400",
    description: "Manchester City 24/25 Home shirt. Featuring details inspired by the 0161 area code of Manchester on the collar and cuffs, matching the club's deep roots in the city.",
    sizes: ["S", "M", "L", "XL"],
    specs: {
      Material: "100% Jacquard Polyester",
      Fit: "Regular fit",
      Technology: "dryCELL moisture management",
      Crest: "Embroidered club badge",
      Details: "0161 graphic collar details"
    },
    design: {
      primaryColor: "#6caddf",      // Sky blue
      secondaryColor: "#1c2c5b",    // Dark navy details
      stripeType: "solid",
      sponsorText: "Etihad Airways",
      numberText: "17",
      collarColor: "#1c2c5b",
      badgeColor: "#1c2c5b"
    },
    reviews: [
      { id: 1, user: "Samiul O.", rating: 5, comment: "Great color and fabric feel. Speed delivery too!", date: "2026-05-25" }
    ]
  },
  {
    id: "bra-home-2024",
    name: "Brazil 2024 Home Jersey",
    category: "National Teams",
    price: 3800,
    originalPrice: 4400,
    isNew: false,
    isBestSeller: true,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&q=80&w=400",
    description: "The 2024 Brazil Home Jersey features the iconic yellow with subtle texture patterns celebrating Brazil's biodiversity and rich musical heritage. Completed with a centered CBF crest.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    specs: {
      Material: "100% Recycled Polyester Jacquard",
      Fit: "Standard fit",
      Technology: "Dri-FIT performance",
      Crest: "Woven center-applied emblem",
      Details: "Jaguar pattern details throughout the weave"
    },
    design: {
      primaryColor: "#fedd00",      // Brazil yellow
      secondaryColor: "#009b3a",    // Brazil green
      stripeType: "solid",
      sponsorText: "BRASIL",
      numberText: "10",
      collarColor: "#009b3a",
      badgeColor: "#009b3a"
    },
    reviews: [
      { id: 1, user: "Zayed N.", rating: 4, comment: "Beautiful textures. The yellow shade is bright and premium.", date: "2026-05-28" }
    ]
  },
  {
    id: "ars-home-24",
    name: "Arsenal 24/25 Home Jersey",
    category: "Club Teams",
    price: 4100,
    originalPrice: 4650,
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1589487390382-6ebf70c2a210?auto=format&fit=crop&q=80&w=400",
    description: "The Arsenal 2024/25 Home Jersey brings back the iconic clean white sleeves over a solid red torso design. Features the clean Canon emblem in place of the standard club crest.",
    sizes: ["S", "M", "L", "XL"],
    specs: {
      Material: "100% Polyester Doubleknit",
      Fit: "Slim fit",
      Technology: "AEROREADY ventilation",
      Crest: "Woven Cannon crest",
      Details: "Contrasting white sleeves and dark navy details"
    },
    design: {
      primaryColor: "#ef3e36",      // Red
      secondaryColor: "#ffffff",    // White
      stripeType: "sleeves-contrast", // Red body, white sleeves
      sponsorText: "Fly Emirates",
      numberText: "8",
      collarColor: "#ef3e36",
      badgeColor: "#ef3e36"
    },
    reviews: [
      { id: 1, user: "Abir S.", rating: 5, comment: "The cannon emblem is perfect. Jersey fits like a glove.", date: "2026-06-01" }
    ]
  },
  {
    id: "ger-home-24",
    name: "Germany 2024 Home Jersey",
    category: "National Teams",
    price: 3750,
    originalPrice: 4300,
    isNew: false,
    isBestSeller: false,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400",
    description: "The Germany 2024 Home Jersey features a clean white base with an eye-catching eagle-wing-inspired sleeve gradient in the black, red, and gold of the German flag.",
    sizes: ["S", "M", "L", "XL"],
    specs: {
      Material: "100% Recycled Polyester",
      Fit: "Regular fit",
      Technology: "AEROREADY breathable fabric",
      Crest: "Eagle badge printed",
      Details: "Eagle-wing color gradients on shoulders"
    },
    design: {
      primaryColor: "#ffffff",      // White
      secondaryColor: "#000000",    // Black
      stripeType: "solid",
      sponsorText: "DFB",
      numberText: "8",
      collarColor: "#000000",
      badgeColor: "#000000"
    },
    reviews: [
      { id: 1, user: "Noyon M.", rating: 5, comment: "Classic German style. Sleeve details are fantastic.", date: "2026-05-12" }
    ]
  },
  {
    id: "fra-home-24",
    name: "France 2024 Home Jersey",
    category: "National Teams",
    price: 3900,
    originalPrice: 4500,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400",
    description: "France 2024 Home Jersey. Highlighting the classic royal blue base with an oversized retro rooster crest and a tricolor collar honoring the French Republic.",
    sizes: ["M", "L", "XL", "XXL"],
    specs: {
      Material: "100% Recycled Polyester",
      Fit: "Slim fit",
      Technology: "Dri-FIT ADV heat reduction",
      Crest: "Oversized woven Rooster badge",
      Details: "Tricolor ribbed collar detailing"
    },
    design: {
      primaryColor: "#002060",      // French Royal Blue
      secondaryColor: "#ffffff",    // White details
      stripeType: "solid",
      sponsorText: "F F F",
      numberText: "10",
      collarColor: "#002060",
      badgeColor: "#e5c158"
    },
    reviews: [
      { id: 1, user: "Kazi I.", rating: 5, comment: "Oversized crest looks very vintage and premium. Love it.", date: "2026-05-30" }
    ]
  }
];

export const getProductById = (id) => products.find(p => p.id === id);
