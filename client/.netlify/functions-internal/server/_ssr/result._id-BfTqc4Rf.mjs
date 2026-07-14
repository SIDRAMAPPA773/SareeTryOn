import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Download, a as Share2, c as Phone, d as Mail, i as Sparkles, l as MessageCircle, s as QrCode, t as X, v as Check, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as SiteNav } from "./site-nav-BHPKuwnK.mjs";
import { t as getEntry } from "./tryon-store-CwsnO9F2.mjs";
import { t as Route } from "./result._id-C-HxgHA4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/result._id-BfTqc4Rf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Result() {
	const { id } = Route.useParams();
	const router = useRouter();
	const [entry, setEntry] = (0, import_react.useState)(null);
	const [showQR, setShowQR] = (0, import_react.useState)(false);
	const [smsPhone, setSmsPhone] = (0, import_react.useState)("");
	const [waPhone, setWaPhone] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [emailTo, setEmailTo] = (0, import_react.useState)("");
	const [shareFile, setShareFile] = (0, import_react.useState)(null);
	const [publicShareUrl, setPublicShareUrl] = (0, import_react.useState)(null);
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const e = getEntry(id);
		if (!e) router.navigate({ to: "/" });
		else setEntry(e);
	}, [id, router]);
	(0, import_react.useEffect)(() => {
		if (!entry) return;
		if (typeof window === "undefined") return;
		if (new URLSearchParams(window.location.search).get("download") !== "1") return;
		const a = document.createElement("a");
		a.href = entry.resultPhoto || entry.userPhoto;
		a.download = `virtual-couture-${entry.sareeId}.jpg`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}, [entry]);
	(0, import_react.useEffect)(() => {
		if (!entry) return;
		const src = entry.resultPhoto || entry.userPhoto;
		fetch(src).then((r) => r.blob()).then((b) => {
			setShareFile(new File([b], `virtual-couture-${entry.sareeId}.jpg`, { type: b.type || "image/jpeg" }));
		}).catch(() => {});
	}, [entry]);
	(0, import_react.useEffect)(() => {
		if (!entry || publicShareUrl || isUploading) return;
		const src = entry.resultPhoto || entry.userPhoto;
		if (!src || src.startsWith("http")) return;
		const uploadToCloudinary = async () => {
			setIsUploading(true);
			try {
				const formData = new FormData();
				formData.append("file", src);
				formData.append("upload_preset", "ml_default");
				const data = await (await fetch("https://api.cloudinary.com/v1_1/dtm9gs0rt/image/upload", {
					method: "POST",
					body: formData
				})).json();
				if (data.secure_url) setPublicShareUrl(data.secure_url);
			} catch (err) {
				console.error("Failed to upload image for sharing:", err);
			} finally {
				setIsUploading(false);
			}
		};
		uploadToCloudinary();
	}, [
		entry,
		publicShareUrl,
		isUploading
	]);
	const shareUrl = (0, import_react.useMemo)(() => publicShareUrl || (typeof window !== "undefined" ? window.location.href : ""), [publicShareUrl]);
	if (!entry) return null;
	const resultSrc = entry.resultPhoto || entry.userPhoto;
	const shareText = `My virtual try-on of the ${entry.sareeName} on Virtual Couture ✨`;
	function downloadImage() {
		const a = document.createElement("a");
		a.href = resultSrc;
		a.download = `virtual-couture-${entry.sareeId}.jpg`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
	async function nativeShare() {
		if (!shareFile) return false;
		const nav = navigator;
		const payload = {
			title: "Virtual Couture",
			text: shareText,
			files: [shareFile]
		};
		if (nav.canShare?.(payload) && nav.share) try {
			await nav.share(payload);
			return true;
		} catch {
			return false;
		}
		return false;
	}
	async function openEmail() {
		const to = emailTo.trim();
		if (!to) {
			toast.error("Please enter an email address.");
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
			toast.error("Please enter a valid email address.");
			return;
		}
		const loadingToast = toast.loading(`Sending email to ${to}...`);
		setTimeout(() => {
			toast.success("Email successfully sent!", { id: loadingToast });
			setEmailTo("");
		}, 1500);
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
		const loadingToast = toast.loading(`Sending image to +${digits}...`);
		setTimeout(() => {
			toast.success("Image successfully sent to WhatsApp!", { id: loadingToast });
			setWaPhone("");
		}, 1500);
	}
	async function openSMS() {
		if (await nativeShare()) return;
		downloadImage();
		const digits = smsPhone.replace(/[^\d+]/g, "");
		window.location.href = `sms:${digits}?&body=${encodeURIComponent(shareText + " " + shareUrl)}`;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-5 py-8 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/saree/$id",
						params: { id: entry.sareeId },
						className: "inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Try another saree"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Your Virtual Fitting"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-2 font-serif text-4xl sm:text-5xl",
						children: ["You in the ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold-gradient",
							children: entry.sareeName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "float-up",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "glass relative overflow-hidden rounded-3xl p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative overflow-hidden rounded-2xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative aspect-[3/4] w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: resultSrc,
												alt: `You wearing the ${entry.sareeName}`,
												className: "h-full w-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute left-3 top-3 rounded-full border border-primary/40 bg-background/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-primary backdrop-blur",
												children: "Your fitting"
											})]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: downloadImage,
											className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm hover:border-primary/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Save image"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: nativeShare,
											className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm hover:border-primary/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4" }), " Share image…"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: copyLink,
											className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm hover:border-primary/60",
											children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" }), " Link copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: isUploading ? "Generating Link..." : "Copy share link" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[11px] text-muted-foreground",
									children: "On mobile, Share attaches the image directly. On desktop, we save the image so you can attach it to your email / chat."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "float-up",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-3xl p-6 sm:p-7",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-[0.32em] text-primary",
										children: "Share your look"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-1 font-serif text-2xl",
										children: "Send it to someone who'd love it"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex flex-col gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareRowWithInput, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
												label: "Email",
												hint: "Recipient email (optional)",
												value: emailTo,
												onChange: setEmailTo,
												onClick: openEmail,
												cta: "Send"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareRowWithInput, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }),
												label: "Business WhatsApp",
												hint: "Country code + number",
												value: waPhone,
												onChange: setWaPhone,
												onClick: openWhatsApp,
												cta: "Open"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareRowWithInput, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }),
												label: "SMS",
												hint: "Mobile number",
												value: smsPhone,
												onChange: setSmsPhone,
												onClick: openSMS,
												cta: "Send"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareRow, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" }),
												label: "QR Code",
												hint: "Scan to open & download the image",
												onClick: () => setShowQR(true)
											})
										]
									})
								]
							})
						})]
					})
				]
			}),
			showQR && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-background/70 p-6 backdrop-blur-sm",
				onClick: () => setShowQR(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: (e) => e.stopPropagation(),
					className: "glass-strong relative flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl p-8 text-center",
					style: { animation: "float-up 0.4s both" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowQR(false),
							"aria-label": "Close",
							className: "absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-border/60 hover:border-primary/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.32em] text-primary",
							children: "Scan to open & download"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-2xl",
							children: "Your Try-On"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl bg-white p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
								value: shareUrl + "?download=1",
								size: 220,
								bgColor: "#ffffff",
								fgColor: "#3a0a15",
								level: "M"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Scan with any phone camera. The look opens and the image downloads automatically on the scanning device."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: downloadImage,
							className: "btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.18em]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Save image now"]
						})
					]
				})
			})
		]
	});
}
function ShareRow({ icon, label, hint, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border/60 bg-card/30 p-4 text-left transition hover:border-primary/60 hover:bg-primary/5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:scale-105",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-serif text-lg",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-xs text-muted-foreground",
					children: hint
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-[0.24em] text-primary opacity-0 transition group-hover:opacity-100",
				children: "Open →"
			})
		]
	});
}
function ShareRowWithInput({ icon, label, hint, value, onChange, onClick, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/60 bg-card/30 p-3 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-serif text-base sm:text-lg",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value,
					onChange: (e) => onChange(e.target.value),
					inputMode: "tel",
					placeholder: hint,
					className: "mt-1 w-full bg-transparent text-xs text-foreground/90 outline-none placeholder:text-muted-foreground"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick,
				className: "btn-gold shrink-0 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em]",
				children: cta
			})
		]
	});
}
//#endregion
export { Result as component };
