export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "AI Cutlery",
    price: 299.99,
    description: "Uses advanced LLMs to make your food taste better.",
    image:
      "https://images.unsplash.com/photo-1503197553955-b4eafae3e08e?w=400&h=400&fit=crop",
    category: "Smart Kitchen",
  },
  {
    id: 2,
    name: "Existential Insurance",
    price: 999.99,
    description: "Protects you from the crushing weight of existence.",
    image:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=400&fit=crop",
    category: "Life Services",
  },
  {
    id: 3,
    name: "Participation Trophy",
    price: 19.99,
    description:
      "Perfect for those who tried their best (or at least showed up)",
    image:
      "https://plus.unsplash.com/premium_photo-1683749805319-2c481ae54bc1?w=400&h=400&fit=crop",
    category: "Awards & Recognition",
  },
  {
    id: 4,
    name: "Offline Cloud Storage",
    price: 149.99,
    description: "Store your clouds offline",
    image:
      "https://media.istockphoto.com/id/180639404/photo/cotton-balls-in-jar.webp?a=1&b=1&s=612x612&w=0&k=20&c=OojvMlPFaiYOodkJhPgnKDI1h7OzPQ7tiwRsb9owKII=",
    category: "Storage Solutions",
  },
  {
    id: 5,
    name: "Emergency Button",
    price: 79.99,
    description:
      "Press it when you need help, attention, or just want to feel important",
    image:
      "https://media.istockphoto.com/id/585171778/photo/red-button-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=S41DksKkufDMb_VUwUWL3OMi7Vp_OwN2YQwzvO0Pb5Q=",
    category: "Safety & Security",
  },
  {
    id: 6,
    name: "Mystery Item",
    price: 29.99,
    description:
      "Nobody knows what's inside! Could be amazing, could be terrible. That's the mystery of the Mystery Item",
    image:
      "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?w=400&h=400&fit=crop",
    category: "Mystery & Surprise",
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}
