import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { SiteNav } from "@/views/components/site-nav";
import { getSaree, formatPrice } from "@/models/data/sarees";

export const Route = createFileRoute("/saree/$id")({
  loader: ({ params }) => {
    const saree = getSaree(params.id);
    if (!saree) throw notFound();
    return { saree };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.saree.name} — Virtual Couture` },
          { name: "description", content: loaderData.saree.description },
          { property: "og:title", content: `${loaderData.saree.name} — Virtual Couture` },
          { property: "og:description", content: loaderData.saree.description },
          { property: "og:image", content: loaderData.saree.image },
        ]
      : [{ title: "Not found" }, { name: "robots", content: "noindex" }],
  }),
  component: SareeDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-muted-foreground">
      Saree not found.
    </div>
  ),
});

const ANGLES = ["Full", "Pallu", "Border", "Drape"] as const;

function SareeDetail() {
  const { saree } = Route.useLoaderData();
  const [angle, setAngle] = useState<(typeof ANGLES)[number]>("Full");

  // Detail crops on a single hero asset — honest close-ups, not fake
  // opposite-side renders.
  const transformByAngle: Record<(typeof ANGLES)[number], string> = {
    Full: "none",
    Pallu: "scale(1.9) translate(-14%, -22%)",
    Border: "scale(2.1) translate(0%, 26%)",
    Drape: "scale(1.55) translate(6%, 4%)",
  };

  return (
    <div className="min-h-screen">
      <SiteNav />

      <div className="mx-auto max-w-7xl px-5 pt-24 pb-8 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to collection
        </Link>

        <div className="mt-6 grid gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Gallery */}
          <div className="reveal-up relative">
            <div className="relative overflow-hidden glass-premium">
              <div className="relative aspect-[3/4]">
                <img
                  src={saree.image}
                  alt={`${saree.name} — ${angle}`}
                  width={768}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out"
                  style={{ transform: transformByAngle[angle] }}
                />

                <span className="absolute left-5 top-5 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-primary backdrop-blur shadow-sm">
                  {angle} view
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              {ANGLES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    a === angle
                      ? "border-primary/80 shadow-[0_0_15px_var(--gold)/20] scale-[1.02]"
                      : "border-border/40 hover:border-primary/60 hover:scale-105"
                  }`}
                >
                  <div className="relative aspect-square">
                    <img
                      src={saree.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ transform: transformByAngle[a] }}
                    />
                    <span className="absolute inset-x-0 bottom-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-shadow-light">
                      {a}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="reveal-up flex flex-col gap-6 xl:pt-4" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary">
              <Sparkles className="h-4 w-4 animate-pulse" />
              {saree.category} · Try-on ready
            </div>
            <div>
              <h1 className="font-serif text-5xl sm:text-7xl text-foreground tracking-tight">{saree.name}</h1>
              <p className="mt-4 text-2xl text-muted-foreground italic">{saree.subtitle}</p>
            </div>

            <div className="flex items-baseline gap-4 mt-4">
              <span className="font-serif text-4xl text-primary">
                {formatPrice(saree.price)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
                Inclusive of all taxes
              </span>
            </div>

            <p className="text-base leading-relaxed text-foreground/85 mt-2">{saree.description}</p>

            <dl className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div className="glass-premium rounded-2xl border border-border/40 p-5 transition-transform hover:-translate-y-1">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                  Fabric
                </dt>
                <dd className="mt-2 text-base">{saree.fabric}</dd>
              </div>
              <div className="glass-premium rounded-2xl border border-border/40 p-5 transition-transform hover:-translate-y-1">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                  Origin
                </dt>
                <dd className="mt-2 text-base">{saree.origin}</dd>
              </div>
            </dl>

            <ul className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-6">
              {["Hand-finished", "Ships in 3 days", "Complimentary blouse piece"].map((f) => (
                <li
                  key={f}
                  className="inline-flex items-center gap-2 border border-border bg-card px-5 py-2.5 transition-colors hover:border-primary hover:text-primary uppercase tracking-wider text-[10px]"
                >
                  <Check className="h-3.5 w-3.5 text-primary" /> {f}
                </li>
              ))}
            </ul>

            <Link
              to="/try-on/$id"
              params={{ id: saree.id }}
              className="btn-gold relative overflow-hidden mt-10 inline-flex items-center justify-center gap-3 px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase"
            >
              <Sparkles className="h-5 w-5" />
              Virtual Try-On
            </Link>

            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 mt-2">
              Powered by on-device AI · Your photo stays with you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}