import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Sparkles, v as Check, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as SiteNav } from "./site-nav-BHPKuwnK.mjs";
import { t as formatPrice } from "./sarees-D4QX0580.mjs";
import { t as Route } from "./saree._id-D5_ahWJM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saree._id-DCl6V_8j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ANGLES = [
	"Full",
	"Pallu",
	"Border",
	"Drape"
];
function SareeDetail() {
	const { saree } = Route.useLoaderData();
	const [angle, setAngle] = (0, import_react.useState)("Full");
	const transformByAngle = {
		Full: "none",
		Pallu: "scale(1.9) translate(-14%, -22%)",
		Border: "scale(2.1) translate(0%, 26%)",
		Drape: "scale(1.55) translate(6%, 4%)"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5 py-8 sm:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground transition hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to collection"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "reveal-up relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-hidden glass-premium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[3/4]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: saree.image,
									alt: `${saree.name} — ${angle}`,
									width: 768,
									height: 1024,
									className: "h-full w-full object-cover transition-transform duration-700 ease-out",
									style: { transform: transformByAngle[angle] }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60 pointer-events-none" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute left-5 top-5 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-primary backdrop-blur shadow-sm",
									children: [angle, " view"]
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid grid-cols-4 gap-3",
						children: ANGLES.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAngle(a),
							className: `group relative overflow-hidden rounded-2xl border transition-all duration-300 ${a === angle ? "border-primary/80 shadow-[0_0_15px_var(--gold)/20] scale-[1.02]" : "border-border/40 hover:border-primary/60 hover:scale-105"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-square",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: saree.image,
										alt: "",
										className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
										style: { transform: transformByAngle[a] }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity group-hover:opacity-80" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute inset-x-0 bottom-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary",
										children: a
									})
								]
							})
						}, a))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "reveal-up flex flex-col gap-6 lg:pt-4",
					style: { animationDelay: "200ms" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 animate-pulse" }),
								saree.category,
								" · Try-on ready"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-5xl sm:text-7xl text-foreground tracking-tight",
							children: saree.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-2xl text-muted-foreground italic",
							children: saree.subtitle
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-4 mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-4xl text-primary",
								children: formatPrice(saree.price)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80",
								children: "Inclusive of all taxes"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base leading-relaxed text-foreground/85 mt-2",
							children: saree.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-2 gap-4 text-sm mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-premium rounded-2xl border border-border/40 p-5 transition-transform hover:-translate-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80",
									children: "Fabric"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-2 text-base",
									children: saree.fabric
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-premium rounded-2xl border border-border/40 p-5 transition-transform hover:-translate-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80",
									children: "Origin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-2 text-base",
									children: saree.origin
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-wrap gap-3 text-xs text-muted-foreground mt-6",
							children: [
								"Hand-finished",
								"Ships in 3 days",
								"Complimentary blouse piece"
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "inline-flex items-center gap-2 border border-border bg-card px-5 py-2.5 transition-colors hover:border-primary hover:text-primary uppercase tracking-wider text-[10px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" }),
									" ",
									f
								]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/try-on/$id",
							params: { id: saree.id },
							className: "btn-gold relative overflow-hidden mt-10 inline-flex items-center justify-center gap-3 px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" }), "Virtual Try-On"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 mt-2",
							children: "Powered by on-device AI · Your photo stays with you"
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { SareeDetail as component };
