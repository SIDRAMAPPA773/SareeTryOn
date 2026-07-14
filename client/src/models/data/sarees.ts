import { API_BASE_URL } from "@/config/api";

export type SareeCategory = "Silk" | "Cotton" | "Georgette" | string;

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

export const categories: ("Catalog" | SareeCategory)[] = [
  "Catalog",
  "Silk",
  "Cotton",
  "Georgette",
];

// Helper to map backend data to the expected frontend format
function mapBackendSaree(data: any): Saree {
  return {
    id: data._id,
    name: data.name,
    subtitle: `${data.color} ${data.fabric}`,
    price: data.price || 15000, // Fallback price
    category: data.category || "Silk",
    image: data.imageUrl,
    palette: ["#000000", "#ffffff"], // Fallback palette
    description: data.description,
    fabric: data.fabric,
    origin: "India", // Fallback origin
  };
}

export async function fetchSarees(): Promise<Saree[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/sarees`);
    if (!res.ok) throw new Error("Failed to fetch sarees");
    const json = await res.json();
    if (json.success && json.data) {
      return json.data.map(mapBackendSaree);
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSaree(id: string): Promise<Saree | undefined> {
  const sarees = await fetchSarees();
  return sarees.find((s) => s.id === id);
}

export function formatPrice(v: number): string {
  return "₹" + v.toLocaleString("en-IN");
}