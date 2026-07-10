/**
 * Level 1 marketplace category hierarchy (presentation + product scope).
 * Homepage shows MAIN_CATEGORIES only. Subcategories live on category pages as chips.
 */
import { categoriesData } from "../../static/data";
import { resolveCategoryPhoto } from "./categoryPhotoMap";

const uniq = (titles) => [...new Set(titles.filter(Boolean))];

const subs = (...parentTitles) => {
  const titles = [];
  parentTitles.forEach((parentTitle) => {
    const parent = categoriesData.find((c) => c.title === parentTitle);
    parent?.subcategories?.forEach((sub) => titles.push(sub.title));
  });
  return uniq(titles);
};

const P = {
  computers: "Computers & Electronics",
  phones: "Phones & Accessories",
  beauty: "Cosmetics & Personal Care",
  home: "Home & Furniture",
  clothing: "Clothing & Apparel",
  shoes: "Shoes & Footwear",
  jewelry: "Jewelry & Watches",
  toys: "Toys & Games",
  sports: "Sports & Outdoors",
  books: "Books & Magazines",
  food: "Food & Beverages",
  auto: "Automotive",
  cameras: "Cameras & Photography",
  health: "Health & Wellness",
  pets: "Pet Supplies",
  baby: "Baby & Kids",
  office: "Office & School Supplies",
};

const ELECTRONICS_TITLES = [
  "Monitors",
  "Networking",
  "Printers & Scanners",
  "Smart Home Devices",
  "Software",
  "External Storage",
  "VR & AR",
];

const COMPUTER_TITLES = ["Laptops", "Desktops", "Tablets", "Computer Accessories"];

const GAMING_TITLES = ["Gaming", "Video Games", "Remote Control Toys", "Mobile Gaming Accessories"];

const FASHION_SHOE_TITLES = subs(P.shoes);
const FASHION_CLOTHING_TITLES = subs(P.clothing);
const FASHION_JEWELRY_TITLES = subs(P.jewelry);

const FASHION_MEN_TITLES = [
  "T-Shirts",
  "Jeans",
  "Jackets & Outerwear",
  "Suits & Blazers",
  "Formal Wear",
  "Hoodies & Sweatshirts",
  "Pants & Trousers",
  "Shorts",
  "Formal Shoes",
  "Loafers",
  "Casual Shoes",
  "Boots",
  "Sneakers",
  "Men's Watches",
  "Men's Grooming",
];

const FASHION_WOMEN_TITLES = [
  "Dresses",
  "Skirts",
  "Lingerie & Sleepwear",
  "Swimwear",
  "High Heels",
  "Women's Watches",
  "Makeup",
  "Skincare",
  "Fragrances",
  "Necklaces & Chains",
  "Rings",
  "Earrings",
  "Bracelets & Bangles",
];

const FASHION_KIDS_TITLES = [
  "Kids' Clothing",
  "Kids' Footwear",
  "Baby Clothing",
  "Toys & Learning",
];

const FASHION_ACCESSORY_TITLES = [
  "Watches Accessories",
  "Brooches & Pins",
  "Cufflinks & Tie Clips",
  "Engagement & Wedding Rings",
  "Phone Cases",
  "Chargers & Cables",
];

const chip = (id, label, matchTitles, isAll = false) => ({
  id,
  label,
  isAll,
  matchTitles: isAll ? null : matchTitles,
});

export const MAIN_CATEGORIES = [
  {
    id: "electronics",
    title: "Electronics",
    description: "Monitors, networking, smart home, and everyday tech essentials.",
    allMatchTitles: ELECTRONICS_TITLES,
    chips: [
      chip("all", "All", null, true),
      chip("monitors", "Monitors", ["Monitors"]),
      chip("networking", "Networking", ["Networking"]),
      chip("printers", "Printers & Scanners", ["Printers & Scanners"]),
      chip("smart-home", "Smart Home", ["Smart Home Devices"]),
      chip("software", "Software", ["Software"]),
      chip("storage", "Storage", ["External Storage"]),
      chip("vr", "VR & AR", ["VR & AR"]),
    ],
  },
  {
    id: "phones",
    title: "Phones",
    description: "Smartphones, cases, chargers, earbuds, and mobile essentials.",
    allMatchTitles: subs(P.phones),
    chips: [
      chip("all", "All", null, true),
      chip("smartphones", "Smartphones", ["Smartphones"]),
      chip("cases", "Cases", ["Phone Cases", "Screen Protectors"]),
      chip("audio", "Audio", ["Headphones", "Wireless Earbuds", "Bluetooth Speakers"]),
      chip("chargers", "Chargers", ["Chargers & Cables", "Power Banks"]),
      chip("wearables", "Wearables", ["Smartwatches"]),
      chip("accessories", "Accessories", [
        "Mobile Accessories",
        "Selfie Sticks & Tripods",
        "Car Phone Holders",
        "SIM Cards & Adapters",
      ]),
    ],
  },
  {
    id: "computers",
    title: "Computers",
    description: "Laptops, desktops, tablets, and computer accessories.",
    allMatchTitles: COMPUTER_TITLES,
    chips: [
      chip("all", "All", null, true),
      chip("laptops", "Laptops", ["Laptops"]),
      chip("desktops", "Desktops", ["Desktops"]),
      chip("tablets", "Tablets", ["Tablets"]),
      chip("accessories", "Accessories", ["Computer Accessories", "External Storage"]),
    ],
  },
  {
    id: "fashion",
    title: "Fashion",
    description: "Clothing, shoes, jewelry, and style for every occasion.",
    allMatchTitles: uniq([
      ...FASHION_CLOTHING_TITLES,
      ...FASHION_SHOE_TITLES,
      ...FASHION_JEWELRY_TITLES,
    ]),
    chips: [
      chip("all", "All", null, true),
      chip("shoes", "Shoes", FASHION_SHOE_TITLES),
      chip("men", "Men", FASHION_MEN_TITLES),
      chip("women", "Women", FASHION_WOMEN_TITLES),
      chip("kids", "Kids", FASHION_KIDS_TITLES),
      chip("jewelry", "Jewelry", FASHION_JEWELRY_TITLES),
      chip("watches", "Watches", ["Men's Watches", "Women's Watches", "Watches Accessories"]),
      chip("accessories", "Accessories", FASHION_ACCESSORY_TITLES),
    ],
  },
  {
    id: "beauty",
    title: "Beauty",
    description: "Skincare, makeup, hair care, fragrances, and grooming.",
    allMatchTitles: subs(P.beauty),
    chips: [
      chip("all", "All", null, true),
      chip("skincare", "Skincare", ["Skincare"]),
      chip("makeup", "Makeup", ["Makeup"]),
      chip("hair", "Hair Care", ["Hair Care"]),
      chip("fragrance", "Fragrance", ["Fragrances"]),
      chip("tools", "Beauty Tools", ["Beauty Tools", "Nail Care"]),
      chip("body", "Bath & Body", ["Bath & Body", "Sun Care & Tanning"]),
      chip("grooming", "Men's Grooming", ["Men's Grooming"]),
    ],
  },
  {
    id: "home-furniture",
    title: "Home & Furniture",
    description: "Living spaces, bedroom, kitchen, décor, and organization.",
    allMatchTitles: subs(P.home),
    chips: [
      chip("all", "All", null, true),
      chip("living", "Living Room", ["Living Room"]),
      chip("bedroom", "Bedroom", ["Bedroom", "Mattresses & Bedding"]),
      chip("kitchen", "Kitchen", ["Dining & Kitchen"]),
      chip("office", "Office", ["Office Furniture"]),
      chip("outdoor", "Outdoor", ["Outdoor Furniture"]),
      chip("lighting", "Lighting", ["Lighting"]),
      chip("decor", "Décor", ["Decor", "Flooring & Rugs", "Window Treatments"]),
      chip("storage", "Storage", ["Storage & Organization"]),
    ],
  },
  {
    id: "groceries",
    title: "Groceries",
    description: "Fresh food, beverages, snacks, and everyday essentials.",
    allMatchTitles: subs(P.food),
    chips: [
      chip("all", "All", null, true),
      chip("fresh", "Fresh", ["Meat & Seafood", "Dairy Products", "Organic Foods"]),
      chip("snacks", "Snacks", ["Snacks"]),
      chip("beverages", "Beverages", ["Beverages", "Coffee & Tea", "Energy Drinks"]),
      chip("bakery", "Bakery", ["Bakery & Confectionery"]),
      chip("frozen", "Frozen", ["Frozen Foods"]),
      chip("pantry", "Pantry", [
        "Canned & Packaged Foods",
        "Spices & Condiments",
        "Grains & Cereals",
        "Nuts & Dry Fruits",
      ]),
      chip("healthy", "Healthy", ["Health Foods", "Instant & Ready-to-Eat"]),
    ],
  },
  {
    id: "automotive",
    title: "Automotive",
    description: "Cars, parts, care products, and vehicle accessories.",
    allMatchTitles: subs(P.auto),
    chips: [
      chip("all", "All", null, true),
      chip("cars", "Cars", ["Cars", "Electric Vehicles", "Motorcycle"]),
      chip("parts", "Parts", [
        "Tires & Wheels",
        "Brakes & Brake Parts",
        "Engines & Components",
        "Performance Parts",
      ]),
      chip("care", "Car Care", ["Car Care Products", "Car Maintenance", "Motor Oils & Fluids"]),
      chip("electronics", "Electronics", ["Car Electronics", "Car Audio & Speakers"]),
      chip("accessories", "Accessories", [
        "Car Accessories",
        "Exterior Accessories",
        "Interior Accessories",
        "Lights & Lighting Accessories",
        "Truck Accessories",
      ]),
    ],
  },
  {
    id: "sports-outdoors",
    title: "Sports & Outdoors",
    description: "Fitness, team sports, camping, cycling, and outdoor gear.",
    allMatchTitles: subs(P.sports),
    chips: [
      chip("all", "All", null, true),
      chip("fitness", "Fitness", ["Running & Jogging", "Yoga & Pilates", "Swimming"]),
      chip("team", "Team Sports", ["Team Sports", "Football", "Basketball"]),
      chip("cycling", "Cycling", ["Cycling"]),
      chip("camping", "Camping", ["Camping & Hiking", "Fishing", "Climbing"]),
      chip("golf", "Golf", ["Golf"]),
      chip("winter", "Winter", ["Winter Sports"]),
    ],
  },
  {
    id: "books",
    title: "Books",
    description: "Fiction, non-fiction, textbooks, children's books, and magazines.",
    allMatchTitles: subs(P.books),
    chips: [
      chip("all", "All", null, true),
      chip("fiction", "Fiction", ["Fiction"]),
      chip("nonfiction", "Non-Fiction", ["Non-Fiction"]),
      chip("children", "Children's", ["Children's Books"]),
      chip("textbooks", "Textbooks", ["Textbooks"]),
      chip("magazines", "Magazines", ["Magazines"]),
    ],
  },
  {
    id: "baby",
    title: "Baby",
    description: "Baby clothing, gear, feeding, and nursery essentials.",
    allMatchTitles: subs(P.baby),
    chips: [
      chip("all", "All", null, true),
      chip("clothing", "Clothing", ["Baby Clothing"]),
      chip("gear", "Gear", ["Baby Gear", "Strollers & Car Seats"]),
      chip("feeding", "Feeding", ["Nursing & Feeding", "Feeding Bottles & Accessories"]),
      chip("diapers", "Diapers", ["Diapers & Wipes"]),
      chip("toys", "Toys", ["Toys & Learning"]),
      chip("nursery", "Nursery", ["Bedding & Furniture", "Health & Safety"]),
      chip("maternity", "Maternity", ["Maternity"]),
    ],
  },
  {
    id: "pets",
    title: "Pets",
    description: "Pet food, toys, grooming, health, and accessories.",
    allMatchTitles: subs(P.pets),
    chips: [
      chip("all", "All", null, true),
      chip("food", "Food", ["Pet Food"]),
      chip("toys", "Toys", ["Pet Toys"]),
      chip("grooming", "Grooming", ["Pet Grooming"]),
      chip("health", "Health", ["Pet Health"]),
      chip("accessories", "Accessories", ["Pet Accessories"]),
    ],
  },
  {
    id: "health",
    title: "Health",
    description: "Wellness, supplements, medical equipment, and personal care.",
    allMatchTitles: subs(P.health),
    chips: [
      chip("all", "All", null, true),
      chip("supplements", "Supplements", ["Vitamins & Supplements"]),
      chip("medical", "Medical", ["Medical Equipment", "Mobility Aids", "First Aid"]),
      chip("fitness", "Fitness", ["Fitness & Weight Loss"]),
      chip("personal", "Personal Care", ["Personal Care", "Dental Care", "Skin Care"]),
      chip("sleep", "Sleep", ["Sleep & Relaxation"]),
      chip("alternative", "Wellness", ["Alternative Medicine"]),
    ],
  },
  {
    id: "office-school",
    title: "Office & School",
    description: "Stationery, writing supplies, organizers, and school essentials.",
    allMatchTitles: subs(P.office),
    chips: [
      chip("all", "All", null, true),
      chip("stationery", "Stationery", ["Stationery"]),
      chip("writing", "Writing", ["Writing Supplies"]),
      chip("school", "School", ["School Supplies"]),
      chip("equipment", "Equipment", ["Office Equipment"]),
      chip("organizers", "Organizers", ["Organizers"]),
    ],
  },
  {
    id: "gaming",
    title: "Gaming",
    description: "Consoles, PC gaming, video games, and gaming accessories.",
    allMatchTitles: GAMING_TITLES,
    chips: [
      chip("all", "All", null, true),
      chip("consoles", "Consoles", ["Gaming", "Video Games"]),
      chip("pc", "PC Gaming", ["Gaming", "Computer Accessories"]),
      chip("mobile", "Mobile Gaming", ["Mobile Gaming Accessories"]),
      chip("rc", "RC & Toys", ["Remote Control Toys"]),
    ],
  },
  {
    id: "cameras",
    title: "Cameras",
    description: "DSLR, mirrorless, lenses, video, and photography gear.",
    allMatchTitles: subs(P.cameras),
    chips: [
      chip("all", "All", null, true),
      chip("dslr", "DSLR", ["DSLR Cameras", "Digital Cameras"]),
      chip("mirrorless", "Mirrorless", ["Mirrorless Cameras"]),
      chip("lenses", "Lenses", ["Camera Lenses"]),
      chip("video", "Video", ["Video Cameras", "Gimbals & Stabilizers"]),
      chip("lighting", "Lighting", ["Lighting Equipment"]),
      chip("bags", "Bags", ["Camera Bags"]),
      chip("accessories", "Accessories", ["Camera Accessories"]),
    ],
  },
];

export const getMainCategoryByTitle = (title) => {
  if (!title) return null;
  const key = title.toLowerCase().trim();
  return (
    MAIN_CATEGORIES.find((c) => c.title.toLowerCase() === key) ||
    MAIN_CATEGORIES.find((c) => c.id === key.replace(/\s+/g, "-"))
  );
};

export const getMainCategoryChips = (mainCategory) => mainCategory?.chips || [];

export const resolveMainCategoryMatchTitles = (mainCategory, chipId = null) => {
  if (!mainCategory) return [];
  if (!chipId || chipId === "all") return mainCategory.allMatchTitles;

  const selected = mainCategory.chips.find((c) => c.id === chipId);
  if (selected?.isAll) return mainCategory.allMatchTitles;
  if (selected?.matchTitles?.length) return selected.matchTitles;

  return mainCategory.allMatchTitles;
};

export const buildMainCategoryUrl = (mainTitle, chipId = null) => {
  const params = new URLSearchParams();
  params.set("category", mainTitle);
  if (chipId && chipId !== "all") params.set("chip", chipId);
  return `/products?${params.toString()}`;
};

/** Shape for mobile nav + desktop mega menu (16 main categories, chips as subcategories). */
export const buildMobileNavCategories = () =>
  MAIN_CATEGORIES.map((main) => ({
    id: main.id,
    title: main.title,
    image_Url: resolveCategoryPhoto(main.title),
    shopAllHref: buildMainCategoryUrl(main.title),
    subcategories: main.chips
      .filter((chip) => !chip.isAll)
      .map((chip) => ({
        id: `${main.id}-${chip.id}`,
        title: chip.label,
        image_Url: resolveCategoryPhoto(chip.label, resolveCategoryPhoto(main.title)),
        href: buildMainCategoryUrl(main.title, chip.id),
      })),
  }));
