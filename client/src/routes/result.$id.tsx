import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Sparkles,
  Mail,
  MessageCircle,
  Phone,
  QrCode,
  X,
  Download,
  Check,
  Share2,
} from "lucide-react";
import { SiteNav } from "@/views/components/site-nav";
import { getEntry, type TryOnEntry } from "@/models/lib/tryon-store";
import { toast } from "sonner";

export const Route = createFileRoute("/result/$id")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: Result,
});

function Result() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<TryOnEntry | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [smsPhone, setSmsPhone] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [shareFile, setShareFile] = useState<File | null>(null);
  
  // Cloudinary public URL state
  const [publicShareUrl, setPublicShareUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const e = getEntry(id);
    if (!e) router.navigate({ to: "/" });
    else setEntry(e);
  }, [id, router]);

  // If arrived via QR (?download=1), auto-save the image once ready.
  useEffect(() => {
    if (!entry) return;
    if (typeof window === "undefined") return;
    const wants = new URLSearchParams(window.location.search).get("download");
    if (wants !== "1") return;
    const a = document.createElement("a");
    a.href = entry.resultPhoto || entry.userPhoto;
    a.download = `virtual-couture-${entry.sareeId}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [entry]);

  // Prepare a File from the generated data URL so we can attach the actual
  // image to Web Share / downloads instead of only a link.
  useEffect(() => {
    if (!entry) return;
    const src = entry.resultPhoto || entry.userPhoto;
    fetch(src)
      .then((r) => r.blob())
      .then((b) => {
        setShareFile(
          new File([b], `virtual-couture-${entry.sareeId}.jpg`, {
            type: b.type || "image/jpeg",
          }),
        );
      })
      .catch(() => {});
  }, [entry]);

  // Upload to Cloudinary to get a public shareable URL
  useEffect(() => {
    if (!entry || publicShareUrl || isUploading) return;
    
    const src = entry.resultPhoto || entry.userPhoto;
    if (!src || src.startsWith("http")) return; // Already a URL

    const uploadToCloudinary = async () => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", src);
        formData.append("upload_preset", "ml_default");
        
        const res = await fetch("https://api.cloudinary.com/v1_1/dtm9gs0rt/image/upload", {
          method: "POST",
          body: formData
        });
        
        const data = await res.json();
        if (data.secure_url) {
          setPublicShareUrl(data.secure_url);
        }
      } catch (err) {
        console.error("Failed to upload image for sharing:", err);
      } finally {
        setIsUploading(false);
      }
    };
    
    uploadToCloudinary();
  }, [entry, publicShareUrl, isUploading]);

  const shareUrl = useMemo(
    () => publicShareUrl || (typeof window !== "undefined" ? window.location.href : ""),
    [publicShareUrl],
  );

  if (!entry) return null;

  const resultSrc = entry.resultPhoto || entry.userPhoto;
  const shareText = `My virtual try-on of the ${entry.sareeName} on Virtual Couture ✨`;

  function downloadImage() {
    const a = document.createElement("a");
    a.href = resultSrc;
    a.download = `virtual-couture-${entry!.sareeId}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function nativeShare() {
    if (!shareFile) return false;
    const nav = navigator as Navigator & {
      canShare?: (d: ShareData) => boolean;
      share?: (d: ShareData) => Promise<void>;
    };
    const payload: ShareData = {
      title: "Virtual Couture",
      text: shareText,
      files: [shareFile],
    };
    if (nav.canShare?.(payload) && nav.share) {
      try {
        await nav.share(payload);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }



  async function openWhatsApp() {
    if (!waPhone) {
      toast.error("Please enter a WhatsApp number.");
      return;
    }
    const digits = waPhone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    
    // Open actual WhatsApp deep link
    window.open(`https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');
    setWaPhone("");
  }

  async function openSMS() {
    if (await nativeShare()) return;
    downloadImage();
    const digits = smsPhone.replace(/[^\d+]/g, "");
    window.location.href = `sms:${digits}?&body=${encodeURIComponent(
      shareText + " " + shareUrl,
    )}`;
  }

  async function copyLink() {
    if (isUploading) {
      alert("Please wait, generating shareable link...");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Dynamic Saree Ambient Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-20 transition-opacity duration-1000">
        <img
          src={entry.sareeImage || resultSrc}
          className="h-full w-full object-cover blur-[100px] scale-110 saturate-150"
          alt=""
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <div className="relative z-10">
        <SiteNav />

        <div className="mx-auto max-w-6xl px-5 pt-24 pb-16 sm:px-8">
          <Link
            to="/saree/$id"
            params={{ id: entry.sareeId }}
            className="reveal-up inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground hover:text-primary transition-colors"
            style={{ animationDelay: "100ms" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Try another drape
          </Link>

          <div 
            className="reveal-up mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80"
            style={{ animationDelay: "200ms" }}
          >
            <Sparkles className="h-4 w-4 text-primary" /> Your Virtual Fitting
          </div>
          
          <h1 
            className="reveal-up mt-3 font-serif text-5xl sm:text-6xl md:text-7xl tracking-tight text-foreground text-shadow-light"
            style={{ animationDelay: "300ms" }}
          >
            You in the <span className="text-gold-gradient italic">{entry.sareeName}</span>
          </h1>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
            {/* Generated composite */}
            <div className="float-up" style={{ animationDelay: "500ms" }}>
              <div className="glass-premium relative overflow-hidden p-2.5 sm:p-3 group shadow-2xl shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-border/50">
                  <div className="relative aspect-[3/4] w-full">
                    <img
                      src={resultSrc}
                      alt={`You wearing the ${entry.sareeName}`}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 shimmer pointer-events-none opacity-40 mix-blend-overlay" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-white backdrop-blur-md shadow-sm text-shadow-dark">
                      Your fitting
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={downloadImage}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-5 py-2.5 text-sm font-medium hover:border-primary/50 hover:bg-card shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" /> Save High-Res
                </button>
                <button
                  onClick={nativeShare}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-5 py-2.5 text-sm font-medium hover:border-primary/50 hover:bg-card shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Share2 className="h-4 w-4" /> Share...
                </button>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-5 py-2.5 text-sm font-medium hover:border-primary/50 hover:bg-card shadow-sm transition-all hover:-translate-y-0.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-primary" /> Link copied
                    </>
                  ) : (
                    <>{isUploading ? "Generating Link..." : "Copy Link"}</>
                  )}
                </button>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground/80 leading-relaxed max-w-md">
                On mobile, Share attaches the image directly. On desktop, we save the
                image so you can easily attach it to your emails or chats.
              </p>
            </div>

            {/* Share panel */}
            <div className="float-up" style={{ animationDelay: "700ms" }}>
              <div className="glass-premium rounded-3xl p-7 sm:p-8 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative z-10">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary/80 text-shadow-light">Share your look</div>
                  <h2 className="mt-2 font-serif text-3xl text-foreground text-shadow-light">Send it to someone who'd love it</h2>

                  <div className="mt-8 flex flex-col gap-3.5">


                    <ShareRowWithInput
                      icon={<MessageCircle className="h-4 w-4" />}
                      label="Business WhatsApp"
                      hint="Country code + number"
                      value={waPhone}
                      onChange={setWaPhone}
                      onClick={openWhatsApp}
                      cta="Open"
                    />

                    <ShareRowWithInput
                      icon={<Phone className="h-4 w-4" />}
                      label="SMS"
                      hint="Mobile number"
                      value={smsPhone}
                      onChange={setSmsPhone}
                      onClick={openSMS}
                      cta="Send"
                    />

                    <ShareRow
                      icon={<QrCode className="h-4 w-4" />}
                      label="Scan & Save"
                      hint="Download to your phone instantly"
                      onClick={() => setShowQR(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showQR && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-6 backdrop-blur-xl transition-all"
            onClick={() => setShowQR(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-premium relative flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl p-8 text-center shadow-2xl shadow-primary/10"
              style={{ animation: "float-up 0.4s both" }}
            >
              <button
                onClick={() => setShowQR(false)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-border/60 hover:border-primary/60 hover:bg-card transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary/80">
                Scan to open & download
              </div>
              <div className="font-serif text-3xl">Your Try-On</div>
              <div className="rounded-2xl bg-white p-5 shadow-inner ring-1 ring-black/5">
                <QRCodeSVG
                  value={resultSrc}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#2a0a10"
                  level="M"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed px-2">
                Scan with any phone camera. The look opens and the image
                downloads automatically on the scanning device.
              </p>
              <button
                onClick={downloadImage}
                className="btn-gold w-full mt-2 inline-flex justify-center items-center gap-2 rounded-full px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em]"
              >
                <Download className="h-4 w-4" /> Save image now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShareRow({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border/60 bg-card/30 p-4 text-left transition hover:border-primary/60 hover:bg-primary/5"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:scale-105">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-lg">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{hint}</span>
      </span>
      <span className="text-[10px] uppercase tracking-[0.24em] text-primary opacity-0 transition group-hover:opacity-100">
        Open →
      </span>
    </button>
  );
}

function ShareRowWithInput({
  icon,
  label,
  hint,
  value,
  onChange,
  onClick,
  cta,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  onClick: () => void;
  cta: string;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/60 bg-card/30 p-3 sm:p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-serif text-base sm:text-lg">{label}</div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="tel"
          placeholder={hint}
          className="mt-1 w-full bg-transparent text-xs text-foreground/90 outline-none placeholder:text-muted-foreground"
        />
      </div>
      <button
        onClick={onClick}
        className="btn-gold shrink-0 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em]"
      >
        {cta}
      </button>
    </div>
  );
}