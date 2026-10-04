export const mockCategories = [
  {
    id: "cat-tshirts",
    name: "T-Shirts",
    handle: "t-shirts",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    description: "Premium cotton & ribbed tees crafted for everyday luxury."
  },
  {
    id: "cat-shirts",
    name: "Shirts",
    handle: "shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    description: "Tailored oxford, linen & casual button-downs."
  },
  {
    id: "cat-jeans",
    name: "Jeans",
    handle: "jeans",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
    description: "Selvedge denim & modern tapered jeans."
  },
  {
    id: "cat-trousers",
    name: "Trousers",
    handle: "trousers",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80",
    description: "Sharp chinos, pleated trousers & tailored trousers."
  },
  {
    id: "cat-jackets",
    name: "Jackets",
    handle: "jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    description: "Bomber jackets, utility coats & leather outerwear."
  },
  {
    id: "cat-suits",
    name: "Suits",
    handle: "suits",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
    description: "Italian cut blazers, tuxedos & two-piece suits."
  },
  {
    id: "cat-activewear",
    name: "Activewear",
    handle: "activewear",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=80",
    description: "Technical hoodies, performance joggers & athletic gear."
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    handle: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    description: "Luxury watches, leather belts & polarized eyewear."
  },
  {
    id: "cat-footwear",
    name: "Footwear",
    handle: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    description: "Handcrafted calfskin loafers & minimalist sneakers."
  }
];

export const mockProducts = [
  {
    id: "prod-101",
    name: "Premium Polo T-Shirt",
    handle: "premium-polo-t-shirt",
    category_id: "cat-tshirts",
    brand: "UrbanMan Signature",
    status: true,
    description: "Crafted from 100% Pima cotton with a refined piqué knit texture. Features double-stitched cuffs, pearlized buttons, and a tailored slim silhouette suitable for smart-casual wear.",
    short_description: "Refined Pima cotton polo with pearlized buttons.",
    price: 1199,
    original_price: 1499,
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-1",
        name: "Color",
        type: "Color",
        options: [
          { id: "c1", value: "Forest Green", color_code: "#1B3B2B" },
          { id: "c2", value: "Off White", color_code: "#E2E8F0" },
          { id: "c3", value: "Matte Black", color_code: "#12171A" },
          { id: "c4", value: "Charcoal Gray", color_code: "#334155" }
        ]
      },
      {
        id: "attr-size-1",
        name: "Size",
        type: "Text",
        options: [
          { id: "s1", value: "S", color_code: "" },
          { id: "s2", value: "M", color_code: "" },
          { id: "s3", value: "L", color_code: "" },
          { id: "s4", value: "XL", color_code: "" }
        ]
      }
    ],
    rating: { rate: 4.8, count: 124 }
  },
  {
    id: "prod-102",
    name: "Slim Fit Oxford Shirt",
    handle: "slim-fit-oxford-shirt",
    category_id: "cat-shirts",
    brand: "UrbanMan Atelier",
    status: true,
    description: "Timeless button-down Oxford shirt crafted from breathable long-staple cotton yarn. Tailored waist curve and structured collar for effortless versatility under a blazer or worn solo.",
    short_description: "Classic long-staple cotton Oxford shirt.",
    price: 1499,
    original_price: 1899,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-2",
        name: "Color",
        type: "Color",
        options: [
          { id: "c5", value: "Light Blue", color_code: "#93C5FD" },
          { id: "c6", value: "Crisp White", color_code: "#FFFFFF" },
          { id: "c7", value: "Navy Blue", color_code: "#1E3A8A" }
        ]
      },
      {
        id: "attr-size-2",
        name: "Size",
        type: "Text",
        options: [
          { id: "s1", value: "S", color_code: "" },
          { id: "s2", value: "M", color_code: "" },
          { id: "s3", value: "L", color_code: "" },
          { id: "s4", value: "XL", color_code: "" }
        ]
      }
    ],
    rating: { rate: 4.9, count: 98 }
  },
  {
    id: "prod-103",
    name: "Straight Fit Raw Denim Jeans",
    handle: "straight-fit-jeans",
    category_id: "cat-jeans",
    brand: "UrbanMan Denim Co.",
    status: true,
    description: "13.5 oz Japanese selvedge denim woven on vintage shuttle looms. Raw indigo finish that ages uniquely with wear, custom copper hardware, and reinforced pocket lining.",
    short_description: "13.5 oz Japanese selvedge denim with raw indigo finish.",
    price: 1899,
    original_price: 2299,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-3",
        name: "Color",
        type: "Color",
        options: [
          { id: "c8", value: "Raw Indigo", color_code: "#1E293B" },
          { id: "c9", value: "Midnight Black", color_code: "#0F172A" },
          { id: "c10", value: "Vintage Wash", color_code: "#475569" }
        ]
      }
    ],
    rating: { rate: 4.7, count: 86 }
  },
  {
    id: "prod-104",
    name: "Olive Utility Bomber Jacket",
    handle: "olive-bomber-jacket",
    category_id: "cat-jackets",
    brand: "UrbanMan Outerwear",
    status: true,
    description: "Water-resistant flight bomber jacket in military forest green. Features satin thermal interior lining, heavy-duty gunmetal dual zips, ribbed collar, and sleeve utility zip pocket.",
    short_description: "Water-resistant flight jacket with satin thermal lining.",
    price: 2499,
    original_price: 3199,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-4",
        name: "Color",
        type: "Color",
        options: [
          { id: "c11", value: "Forest Green", color_code: "#1B3B2B" },
          { id: "c12", value: "Jet Black", color_code: "#000000" },
          { id: "c13", value: "Desert Khaki", color_code: "#A39379" }
        ]
      }
    ],
    rating: { rate: 4.9, count: 142 }
  },
  {
    id: "prod-105",
    name: "Tailored Italian Formal Blazer",
    handle: "tailored-formal-blazer",
    category_id: "cat-suits",
    brand: "UrbanMan Sartorial",
    status: true,
    description: "Italian wool-blend structured single-breasted blazer with notch lapels, soft shoulder padding, dual back vents, and silk viscose interior lining. Perfect for formal galas or boardrooms.",
    short_description: "Italian wool-blend single-breasted structured blazer.",
    price: 3499,
    original_price: 4499,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-5",
        name: "Color",
        type: "Color",
        options: [
          { id: "c14", value: "Midnight Navy", color_code: "#0B132B" },
          { id: "c15", value: "Charcoal Gray", color_code: "#1F2937" }
        ]
      }
    ],
    rating: { rate: 5.0, count: 75 }
  },
  {
    id: "prod-106",
    name: "Linen Relaxed Shirt",
    handle: "linen-shirt",
    category_id: "cat-shirts",
    brand: "UrbanMan Breeze",
    status: true,
    description: "100% Normandy flax linen shirt. Light, breathable texture pre-washed for extra softness. Designed with a resort spread collar and relaxed fit for warm summer evenings.",
    short_description: "100% Normandy flax linen shirt with spread collar.",
    price: 1399,
    original_price: 1799,
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-6",
        name: "Color",
        type: "Color",
        options: [
          { id: "c16", value: "Sage Green", color_code: "#4A6B5D" },
          { id: "c17", value: "Sand Beige", color_code: "#D7C4B7" },
          { id: "c18", value: "Off White", color_code: "#F1F5F9" }
        ]
      }
    ],
    rating: { rate: 4.7, count: 64 }
  },
  {
    id: "prod-107",
    name: "Tactical Cargo Trousers",
    handle: "tactical-cargo-pants",
    category_id: "cat-trousers",
    brand: "UrbanMan Tactical",
    status: true,
    description: "Heavyweight stretch cotton twill cargo trousers with 6 ergonomic utility pockets, articulated knee gussets, and adjustable drawstring ankle cuffs.",
    short_description: "Heavyweight stretch twill cargo trousers with utility pockets.",
    price: 1699,
    original_price: 2199,
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-7",
        name: "Color",
        type: "Color",
        options: [
          { id: "c19", value: "Desert Tan", color_code: "#C2B280" },
          { id: "c20", value: "Stealth Black", color_code: "#171717" },
          { id: "c21", value: "Army Green", color_code: "#4B5320" }
        ]
      }
    ],
    rating: { rate: 4.8, count: 110 }
  },
  {
    id: "prod-108",
    name: "Oversized Heavyweight Tee",
    handle: "oversized-t-shirt",
    category_id: "cat-tshirts",
    brand: "UrbanMan Street",
    status: true,
    description: "260 GSM combed jersey cotton tee with dropped shoulders, boxy drape silhouette, and thick ribbed collar band for modern urban aesthetics.",
    short_description: "260 GSM heavyweight cotton tee with dropped shoulders.",
    price: 1199,
    original_price: 1499,
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-8",
        name: "Color",
        type: "Color",
        options: [
          { id: "c22", value: "Pitch Black", color_code: "#09090B" },
          { id: "c23", value: "Slate Gray", color_code: "#475569" },
          { id: "c24", value: "Olive Drab", color_code: "#3F4E3A" }
        ]
      }
    ],
    rating: { rate: 4.6, count: 52 }
  },
  {
    id: "prod-109",
    name: "Classic Trucker Denim Jacket",
    handle: "denim-jacket",
    category_id: "cat-jackets",
    brand: "UrbanMan Denim Co.",
    status: true,
    description: "Rugged 14 oz denim trucker jacket featuring double chest flap pockets, branded brass buttons, adjustable side waist tabs, and vintage stonewashed patina.",
    short_description: "14 oz stonewashed denim trucker jacket with brass hardware.",
    price: 2199,
    original_price: 2799,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-9",
        name: "Color",
        type: "Color",
        options: [
          { id: "c25", value: "Washed Blue", color_code: "#3B82F6" },
          { id: "c26", value: "Charcoal Denim", color_code: "#1E293B" }
        ]
      }
    ],
    rating: { rate: 4.9, count: 88 }
  },
  {
    id: "prod-110",
    name: "Minimalist Leather Sneakers",
    handle: "classic-sneakers",
    category_id: "cat-footwear",
    brand: "UrbanMan Footwear",
    status: true,
    description: "Full-grain Italian nappa leather sneakers with Margom rubber cupsole, padded memory foam footbed, and wax-coated cotton laces. Effortlessly pairs with denim or suits.",
    short_description: "Italian nappa leather low-top sneakers.",
    price: 1999,
    original_price: 2599,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-10",
        name: "Color",
        type: "Color",
        options: [
          { id: "c27", value: "Pristine White", color_code: "#F8FAFC" },
          { id: "c28", value: "Obsidian Black", color_code: "#0F172A" }
        ]
      }
    ],
    rating: { rate: 4.9, count: 135 }
  },
  {
    id: "prod-111",
    name: "Handcrafted Calfskin Loafers",
    handle: "italian-leather-loafers",
    category_id: "cat-footwear",
    brand: "UrbanMan Footwear",
    status: true,
    description: "Blake-stitched Italian calfskin leather penny loafers with hand-burnished finish, leather sole, and cushioned arch support.",
    short_description: "Hand-burnished Italian calfskin leather loafers.",
    price: 3999,
    original_price: 4999,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-11",
        name: "Color",
        type: "Color",
        options: [
          { id: "c29", value: "Cognac Brown", color_code: "#8B4513" },
          { id: "c30", value: "Midnight Black", color_code: "#111827" }
        ]
      }
    ],
    rating: { rate: 5.0, count: 42 }
  },
  {
    id: "prod-112",
    name: "Minimalist Chronograph Watch",
    handle: "chronograph-watch",
    category_id: "cat-accessories",
    brand: "UrbanMan Timepieces",
    status: true,
    description: "42mm stainless steel case with sapphire crystal glass, Japanese quartz chronograph movement, 50m water resistance, and genuine Italian leather strap.",
    short_description: "42mm stainless steel chronograph with leather strap.",
    price: 4299,
    original_price: 5499,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    attributes: [
      {
        id: "attr-color-12",
        name: "Color",
        type: "Color",
        options: [
          { id: "c31", value: "Rose Gold / Brown", color_code: "#B76E79" },
          { id: "c32", value: "Matte Black", color_code: "#18181B" }
        ]
      }
    ],
    rating: { rate: 4.9, count: 91 }
  }
];
