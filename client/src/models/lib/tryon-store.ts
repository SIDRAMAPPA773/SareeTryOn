export interface TryOnEntry {
  id: string;
  sareeId: string;
  sareeName: string;
  sareeImage: string;
  userPhoto: string; // data url
  resultPhoto?: string; // composited try-on data url
  createdAt: number;
}

const KEY = "vc.tryon.history";
const CURRENT = "vc.tryon.current";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getHistory(): TryOnEntry[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveEntry(entry: TryOnEntry) {
  if (!isBrowser()) return;
  const list = getHistory();
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 24)));
  localStorage.setItem(CURRENT, entry.id);
}

export function getEntry(id: string): TryOnEntry | undefined {
  return getHistory().find((e) => e.id === id);
}

export function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}