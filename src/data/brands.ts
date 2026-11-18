import type { KeyFigure } from "@/types/company";
import type { Brand } from "@/types/brand";

const pendingStatistics: KeyFigure[] = [
  { label: "Restaurant locations", value: null },
  { label: "Countries and regions", value: null },
  { label: "Year founded", value: null },
];

export const brands: Brand[] = [
  {
    slug: "harbor-grill",
    name: "Harbor Grill",
    shortDescription: "Sit-down restaurant brand built around grilled seafood and meats.",
    category: "Casual dining",
    featured: true,
    isSample: true,
    profile: {
      overview: [
        "Harbor Grill is a casual dining brand in the Global Food Group portfolio. Its restaurants focus on grilled seafood and meats served in a sit-down setting.",
      ],
      history: null,
      positioning: null,
      productsAndServices: ["Grilled seafood dishes", "Grilled meat dishes", "Sit-down dining"],
      targetAudience: "Families and groups looking for a sit-down meal.",
      marketPresence: null,
      statistics: pendingStatistics,
      achievements: [],
    },
  },
  {
    slug: "crumb-and-kettle",
    name: "Crumb & Kettle",
    shortDescription: "Café brand serving baked goods, coffee and light meals.",
    category: "Bakery and café",
    featured: true,
    isSample: true,
    profile: {
      overview: [
        "Crumb & Kettle is a bakery and café brand in the Global Food Group portfolio. It serves baked goods, coffee and light meals.",
      ],
      history: null,
      positioning: null,
      productsAndServices: ["Baked goods", "Coffee and tea", "Light meals"],
      targetAudience: "Customers looking for a coffee, a snack or a relaxed place to meet.",
      marketPresence: null,
      statistics: pendingStatistics,
      achievements: [],
    },
  },
  {
    slug: "corner-slice",
    name: "Corner Slice",
    shortDescription: "Pizza brand for dining in, takeaway and delivery.",
    category: "Pizza",
    featured: true,
    isSample: true,
    profile: {
      overview: [
        "Corner Slice is a pizza brand in the Global Food Group portfolio. Customers can eat in, collect an order or have it delivered.",
      ],
      history: null,
      positioning: null,
      productsAndServices: ["Pizza", "Sides and drinks", "Takeaway and delivery"],
      targetAudience: "Individuals, families and groups ordering in person or for delivery.",
      marketPresence: null,
      statistics: pendingStatistics,
      achievements: [],
    },
  },
  {
    slug: "noodle-lane",
    name: "Noodle Lane",
    shortDescription: "Noodle bowls and rice dishes made to order.",
    category: "Fast casual",
    featured: false,
    isSample: true,
    profile: {
      overview: [
        "Noodle Lane is a fast casual brand in the Global Food Group portfolio. Its menu centers on noodle bowls and rice dishes made to order.",
      ],
      history: null,
      positioning: null,
      productsAndServices: ["Noodle bowls", "Rice dishes", "Made-to-order meals"],
      targetAudience: "Customers who want a quick meal prepared fresh.",
      marketPresence: null,
      statistics: pendingStatistics,
      achievements: [],
    },
  },
  {
    slug: "roast-and-co",
    name: "Roast & Co.",
    shortDescription: "Quick-service brand focused on roast chicken meals.",
    category: "Quick service",
    featured: false,
    isSample: true,
    profile: {
      overview: [
        "Roast & Co. is a quick service brand in the Global Food Group portfolio. It focuses on roast chicken meals for eating in or taking away.",
      ],
      history: null,
      positioning: null,
      productsAndServices: ["Roast chicken meals", "Sides", "Takeaway"],
      targetAudience: "Customers who want a quick, filling meal.",
      marketPresence: null,
      statistics: pendingStatistics,
      achievements: [],
    },
  },
];
