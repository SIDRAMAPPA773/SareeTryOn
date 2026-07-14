import { Link } from "@tanstack/react-router";
import { Sparkles, Instagram, Twitter, Facebook, ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to Virtual Couture!");
    setEmail("");
  };

  return (
    <footer className="relative mt-24 border-t border-border/40 bg-background/50 overflow-hidden">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[1000px] rounded-[100%] bg-primary/5 blur-[120px]" />
      
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Link to="/" className="group flex items-center gap-3 w-fit">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/40 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-105 group-hover:shadow-[0_0_20px_var(--gold)/30]">
                <Sparkles className="h-5 w-5 text-primary transition-transform duration-500 group-hover:rotate-12" />
              </span>
              <div className="leading-tight">
                <div className="font-serif text-2xl text-gold-gradient transition-all duration-500 group-hover:brightness-125">Virtual Couture</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground mt-1">
                  AI Saree Studio
                </div>
              </div>
            </Link>
            
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Experience the luxury of virtual draping. We combine state-of-the-art AI with the finest traditional weaves to let you try on breathtaking sarees from anywhere in the world.
            </p>
            
            <div className="flex gap-4 mt-2">
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} label="Facebook" />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3">
            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-lg text-foreground">Collection</h4>
              <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
                <FooterLink to="/">All Sarees</FooterLink>
                <FooterLink to="/">Kanjivaram Silk</FooterLink>
                <FooterLink to="/">Soft Cotton</FooterLink>
                <FooterLink to="/">Designer Georgette</FooterLink>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-serif text-lg text-foreground">Assistance</h4>
              <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
                <FooterLink to="/">Virtual Fitting Guide</FooterLink>
                <FooterLink to="/">Style Advice</FooterLink>
                <FooterLink to="/">Contact Us</FooterLink>
                <FooterLink to="/">FAQs</FooterLink>
              </nav>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <h4 className="font-serif text-lg text-foreground">The Inner Circle</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to receive exclusive access to new seasonal drapes and private AI styling sessions.
            </p>
            <form onSubmit={handleSubscribe} className="mt-2 relative flex items-center group">
              <div className="absolute inset-y-0 left-4 grid place-items-center text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-border/60 bg-card/40 py-3.5 pl-12 pr-32 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/60 focus:bg-card/60 focus:ring-4 focus:ring-primary/5"
              />
              <button
                type="submit"
                className="btn-gold absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-5 text-[10px] font-bold uppercase tracking-[0.2em]"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground tracking-wide">
            &copy; {new Date().getFullYear()} Virtual Couture. Crafted for the modern connoisseur.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/" className="transition hover:text-primary">Privacy Policy</Link>
            <Link to="/" className="transition hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/30 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
    >
      {icon}
    </a>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 transition-colors hover:text-primary"
    >
      <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      <span className="-translate-x-2 transition-transform duration-300 group-hover:translate-x-0">
        {children}
      </span>
    </Link>
  );
}
