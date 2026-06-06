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
    id: "rm-home-25/26",
    name: "Real Madrid 25/26 Home Jersey",
    category: "Club Teams",
    price: 450,
    originalPrice: 500,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    image: "https://easydrop.asia/products/image-1776588693696-692210727.jpeg",
    description: "Real Madrid 2025/26 official home shirt. Features a clean, minimalistic white design with premium houndstooth pattern texturing and gold stripes highlighting the royal club's dominance.",
    sizes: ["M", "L", "XL", "XXL"],
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
    id: "barca-home-25/26",
    name: "FC Barcelona 25/26 Home Jersey",
    category: "Club Teams",
    price: 450,
    originalPrice: 500,
    isNew: true,
    isBestSeller: false,
    rating: 4.7,
    image: "https://easydrop.asia/products/image-1776588932109-152534089.jpeg",
    description: "The FC Barcelona 25/26 season home jersey celebrates the club's 125th anniversary. A classic vertical split pattern returning to the iconic blaugrana colors with gold details.",
    sizes: ["M", "L", "XL", "XXL"],
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

    id: "bra-home-2026",
    name: "Brazil 2026 WORLD CUP Home Jersey",
    category: "National Teams",
    price: 450,
    originalPrice: 500,
    isNew: false,
    isBestSeller: true,
    rating: 4.6,
    image: "https://easydrop.asia/products/image-1777810429237-292865735.jpeg",
    description: "The 2026 WORLD CUP Brazil Home Jersey features the iconic yellow with subtle texture patterns celebrating Brazil's biodiversity and rich musical heritage. Completed with a centered CBF crest.",
    sizes: ["M", "L", "XL", "XXL"],
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
    
    id: "ger-home-26",
    name: "Germany 2026 WORLD CUP Home Jersey",
    category: "National Teams",
    price: 450,
    originalPrice: 500,
    isNew: false,
    isBestSeller: false,
    rating: 4.7,
    image: "https://easydrop.asia/products/image-1777810713597-603805258.jpeg",
    description: "The Germany 2026 WORLD CUP Home Jersey features a clean white base with an eye-catching eagle-wing-inspired sleeve gradient in the black, red, and gold of the German flag.",
    sizes: ["M", "L", "XL", "XXL"],
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
    id: "fra-home-26",
    name: "France 2026 WORLD CUP Home Jersey",
    category: "National Teams",
    price: 450,
    originalPrice: 500,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    image: "https://easydrop.asia/products/image-1777810546145-126722545.jpeg",
    description: "France 2026 WORLD CUP Home Jersey. Highlighting the classic royal blue base with an oversized retro rooster crest and a tricolor collar honoring the French Republic.",
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
