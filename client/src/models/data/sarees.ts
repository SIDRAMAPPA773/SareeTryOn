import s1 from "@/assets/saree-1.jpg";
import s2 from "@/assets/saree-2.jpg";
import s3 from "@/assets/saree-3.jpg";
import s4 from "@/assets/saree-4.jpg";
import s5 from "@/assets/saree-5.jpg";
import s6 from "@/assets/saree-6.jpg";

export type SareeCategory = "Silk" | "Cotton" | "Georgette";

export interface Saree {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  category: SareeCategory;
  image: string;
  palette: string[];
  description: string;
  fabric: string;
  origin: string;
}

export const sarees: Saree[] = [
  {
    id: "kanjivaram-maroon",
    name: "Rubina Kanjivaram",
    subtitle: "Deep maroon silk with pure zari",
    price: 42500,
    category: "Silk",
    image: s1,
    palette: ["#5b0a1a", "#c9a24a"],
    description:
      "Hand-woven Kanjivaram in a rich crimson tone, finished with a traditional gold zari border and lotus motifs.",
    fabric: "Pure mulberry silk with real zari",
    origin: "Kanchipuram, Tamil Nadu",
  },
  {
    id: "banarasi-royal",
    name: "Nila Banarasi",
    subtitle: "Royal blue silk with gold brocade",
    price: 38900,
    category: "Silk",
    image: s2,
    palette: ["#0f2a6b", "#d4a44a"],
    description:
      "A regal Banarasi silk saree woven with intricate gold brocade motifs and a rich pallu.",
    fabric: "Katan silk with zari brocade",
    origin: "Varanasi, Uttar Pradesh",
  },
  {
    id: "cotton-emerald",
    name: "Vana Cotton",
    subtitle: "Emerald green handloom cotton",
    price: 8900,
    category: "Cotton",
    image: s3,
    palette: ["#0e8a4a", "#f4efe3"],
    description:
      "Breathable handloom cotton in a fresh emerald tone with delicate white block prints.",
    fabric: "Handloom cotton",
    origin: "Chettinad, Tamil Nadu",
  },
  {
    id: "georgette-blush",
    name: "Aara Blush Georgette",
    subtitle: "Blush pink with silver sequin",
    price: 24500,
    category: "Georgette",
    image: s4,
    palette: ["#f5c3ce", "#cfcfd6"],
    description:
      "Flowing georgette in a soft blush hue, hand-embellished with subtle silver sequin work.",
    fabric: "Pure georgette with sequin embroidery",
    origin: "Surat, Gujarat",
  },
  {
    id: "tissue-ivory",
    name: "Divya Tissue Silk",
    subtitle: "Ivory tissue with peacock motifs",
    price: 32900,
    category: "Silk",
    image: s5,
    palette: ["#f0e6c8", "#c69240"],
    description:
      "Luminous ivory tissue silk featuring hand-woven peacock motifs on a warm gold border.",
    fabric: "Tissue silk with zari",
    origin: "Bengaluru, Karnataka",
  },
  {
    id: "georgette-noir",
    name: "Kaya Noir",
    subtitle: "Jet black georgette, gold sequin border",
    price: 27500,
    category: "Georgette",
    image: s6,
    palette: ["#0a0a0a", "#c9a24a"],
    description:
      "A dramatic black georgette drape with a molten gold sequin border — pure evening glamour.",
    fabric: "Georgette with hand-cut sequin work",
    origin: "Mumbai, Maharashtra",
  },
];

export const categories: ("Catalog" | SareeCategory)[] = [
  "Catalog",
  "Silk",
  "Cotton",
  "Georgette",
];

export function getSaree(id: string): Saree | undefined {
  return sarees.find((s) => s.id === id);
}

export function formatPrice(v: number): string {
  return "₹" + v.toLocaleString("en-IN");
}