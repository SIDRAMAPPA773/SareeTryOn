import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, Sparkles, History, Home, X, Lock } from "lucide-react";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pt-4 pb-2 pointer-events-none">
        <div className="mx-auto flex max-w-7xl items-center justify-between bg-card rounded-full border border-primary/30 px-6 py-2 shadow-2xl w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] xl:w-[calc(100%-4rem)] pointer-events-auto transition-all duration-500">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/40 transition-all group-hover:bg-primary/20 group-hover:scale-105 group-hover:shadow-[0_0_15px_var(--gold)/30]">
              <Sparkles className="h-4 w-4 text-primary transition-transform group-hover:rotate-12" />
            </span>
            <div className="leading-tight">
              <div className="font-serif text-lg text-gold-gradient transition-all group-hover:brightness-125">Virtual Couture</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                AI Saree Studio
              </div>
            </div>
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/40 text-foreground transition-all hover:border-primary/60 hover:text-primary hover:scale-105 hover:bg-primary/10"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        // @ts-ignore
        inert={!open ? "" : undefined}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`glass-strong absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-6 p-7 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-serif text-2xl text-gold-gradient">Virtual Couture</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Menu
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/60 hover:border-primary/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-4 flex flex-col gap-2">
            <DrawerLink
              to="/"
              onClose={() => setOpen(false)}
              icon={<Home className="h-4 w-4" />}
              label="Home"
              hint="Return to collection"
            />
            <DrawerLink
              to="/history"
              onClose={() => setOpen(false)}
              icon={<History className="h-4 w-4" />}
              label="Try-On History"
              hint="Your virtual fittings"
            />
            <DrawerLink
              to="/admin/login"
              onClose={() => setOpen(false)}
              icon={<Lock className="h-4 w-4" />}
              label="Admin Login"
              hint="Manage store content"
            />
          </nav>

          <div className="mt-auto rounded-2xl border border-primary/25 bg-primary/5 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Powered by AI</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Drape any saree over your own photo in seconds — no studio required.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function DrawerLink({
  to,
  label,
  hint,
  icon,
  onClose,
}: {
  to: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card/40 p-4 transition hover:border-primary/50 hover:bg-primary/5"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:scale-105">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-serif text-lg">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </Link>
  );
}