import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as History, i as Sparkles, m as House, t as X, u as Menu } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-nav-BHPKuwnK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteNav() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: `sticky top-0 z-40 transition-all duration-500 ${scrolled ? "pt-4 pb-2" : "glass border-b border-border/40 py-4"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mx-auto flex max-w-7xl items-center justify-between transition-all duration-500 ${scrolled ? "glass-premium rounded-full border border-primary/30 px-6 py-2 shadow-2xl w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] xl:w-full" : "px-5 sm:px-8 w-full"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "group flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/40 transition-all group-hover:bg-primary/20 group-hover:scale-105 group-hover:shadow-[0_0_15px_var(--gold)/30]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary transition-transform group-hover:rotate-12" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-lg text-gold-gradient transition-all group-hover:brightness-125",
						children: "Virtual Couture"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
						children: "AI Saree Atelier"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setOpen(true),
				"aria-label": "Open menu",
				className: "grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/40 text-foreground transition-all hover:border-primary/60 hover:text-primary hover:scale-105 hover:bg-primary/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`,
		"aria-hidden": !open,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: () => setOpen(false),
			className: `absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: `glass-strong absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-6 p-7 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-2xl text-gold-gradient",
						children: "Virtual Couture"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
						children: "Menu"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						"aria-label": "Close menu",
						className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 hover:border-primary/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-4 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
						to: "/",
						onClose: () => setOpen(false),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }),
						label: "Home",
						hint: "Return to collection"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerLink, {
						to: "/history",
						onClose: () => setOpen(false),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" }),
						label: "Try-On History",
						hint: "Your virtual fittings"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto rounded-2xl border border-primary/25 bg-primary/5 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.2em] text-primary",
						children: "Powered by AI"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Drape any saree over your own photo in seconds — no studio required."
					})]
				})
			]
		})]
	})] });
}
function DrawerLink({ to, label, hint, icon, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		onClick: onClose,
		className: "group flex items-center gap-4 rounded-xl border border-border/50 bg-card/40 p-4 transition hover:border-primary/50 hover:bg-primary/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:scale-105",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-serif text-lg",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-muted-foreground",
				children: hint
			})]
		})]
	});
}
//#endregion
export { SiteNav as t };
