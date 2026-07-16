import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/views/components/site-nav";
import { fetchSarees, categories, formatPrice } from "@/models/data/sarees";
import heroImg from "@/assets/hero.jpg";

import { API_BASE_URL } from "@/config/api";

export const Route = createFileRoute("/")({
  loader: async () => {
    const sarees = await fetchSarees();
    let catalogs = [];
    try {
      const res = await fetch(`${API_BASE_URL}/catalogs`);
      const json = await res.json();
      if (json.success) catalogs = json.data;
    } catch (err) {
      console.error("Failed to fetch catalogs", err);
    }
    return { sarees, catalogs };
  },
  component: Index,
});

function Index() {
  const { sarees, catalogs } = Route.useLoaderData();
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    if (active === "All") return sarees;
    
    // Find the catalog object that is currently active
    const activeCatalog = catalogs.find((c: any) => c.name === active);
    
    if (activeCatalog) {
      // Filter sarees by catalogId matching this catalog
      return sarees.filter((s: any) => s.catalogId === activeCatalog._id || s.category === active);
    }
    
    // Fallback to basic category string matching
    return sarees.filter((s) => s.category === active);
  }, [active, sarees, catalogs]);

  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <img
            src={heroImg}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:py-32">

          <h1 className="reveal-up max-w-4xl font-serif text-6xl leading-[1.1] sm:text-7xl lg:text-9xl tracking-tight" style={{ animationDelay: '300ms' }}>
            <span className="block text-primary">Virtual Couture</span>
            <span className="block text-foreground/90 italic mt-2">draped for you.</span>
          </h1>
          <p className="reveal-up max-w-xl text-base text-muted-foreground sm:text-lg" style={{ animationDelay: '500ms' }}>
            Hand-woven Kanjivarams, breathable cottons and cinematic georgettes — try
            each one on your own photo before you commit.
          </p>

          <div className="reveal-up flex flex-wrap items-center gap-4" style={{ animationDelay: '700ms' }}>
            <a
              href="#collection"
              className="btn-gold inline-flex items-center gap-3 px-10 py-4 text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Explore the Collection
              <ArrowRight className="h-4 w-4" />
            </a>
            <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
              120+ curated drapes · Free virtual fitting
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORY CHIPS */}
      <section
        id="collection"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-6 pt-4 sm:px-8"
      >
        <div className="flex items-end justify-between gap-6 pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-primary">
              The Collection
            </div>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Saree Studio</h2>
          </div>
          <div className="hidden text-xs uppercase tracking-[0.24em] text-muted-foreground sm:block">
            {filtered.length} pieces
          </div>
        </div>

        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {["All", ...catalogs.map((c: any) => c.name)].map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-4 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s, i) => (
            <Link
              key={s.id}
              to="/saree/$id"
              params={{ id: s.id }}
              className="group relative overflow-hidden glass-premium transition-all duration-700 hover:-translate-y-2"
              style={{ animation: `reveal-up 0.8s ${i * 100}ms both` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  width={768}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-1000 group-hover:scale-105"
                />
                {/* Permanent gradient overlay so text is always legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-background/80 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary backdrop-blur-md shadow-sm">
                  {s.category}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-3xl text-white drop-shadow-md">{s.name}</h3>
                    <p className="truncate text-sm text-white/80 mt-1 drop-shadow-sm">{s.subtitle}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-serif text-2xl text-white drop-shadow-md">
                      {formatPrice(s.price)}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/70 mt-1">
                      Try-on ready
                    </div>
                  </div>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  View drape <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
