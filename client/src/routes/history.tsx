import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { History as HistoryIcon, Sparkles, ArrowRight } from "lucide-react";
import { SiteNav } from "@/views/components/site-nav";
import { getHistory, type TryOnEntry } from "@/models/lib/tryon-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Try-On History — Virtual Couture" },
      { name: "description", content: "Every saree you've virtually tried on, saved for you." },
      { property: "og:title", content: "Try-On History — Virtual Couture" },
      { property: "og:description", content: "Every saree you've virtually tried on, saved for you." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<TryOnEntry[]>([]);
  useEffect(() => setItems(getHistory()), []);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-5 pt-24 pb-10 sm:px-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary">
          <HistoryIcon className="h-3.5 w-3.5" /> Your fittings
        </div>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
          <span className="text-gold-gradient">Try-On</span> History
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every drape you've virtually tried, ready to revisit.
        </p>

        {items.length === 0 ? (
          <div className="glass mt-10 flex flex-col items-center gap-4 rounded-3xl p-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
              <Sparkles className="h-6 w-6" />
            </span>
            <div className="font-serif text-2xl">No fittings yet</div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Head to the studio and try on your first saree — it'll appear here.
            </p>
            <Link
              to="/"
              className="btn-gold mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-[0.16em] uppercase"
            >
              Explore collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((e, i) => (
              <Link
                key={e.id}
                to="/result/$id"
                params={{ id: e.id }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/30"
                style={{ animation: `float-up 0.6s ${i * 40}ms both` }}
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={e.resultPhoto || e.sareeImage}
                    alt={e.sareeName}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                  />
                  <img
                    src={e.userPhoto}
                    alt=""
                    className="absolute bottom-3 right-3 h-16 w-16 rounded-full border-2 border-primary/70 object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="truncate font-serif text-lg">{e.sareeName}</div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}