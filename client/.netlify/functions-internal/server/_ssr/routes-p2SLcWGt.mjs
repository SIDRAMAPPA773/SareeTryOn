import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ArrowRight, i as Sparkles } from "../_libs/lucide-react.mjs";
import { t as SiteNav } from "./site-nav-BHPKuwnK.mjs";
import { r as sarees, t as formatPrice } from "./sarees-D4QX0580.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-p2SLcWGt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_default = "/assets/hero-DR21FuO_.jpg";
function Index() {
	const [active, setActive] = (0, import_react.useState)("Catalog");
	const filtered = (0, import_react.useMemo)(() => active === "Catalog" ? sarees : sarees.filter((s) => s.category === active), [active]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_default,
						alt: "",
						width: 1920,
						height: 1080,
						className: "h-full w-full object-cover opacity-70"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 lg:py-32",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reveal-up flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary",
							style: { animationDelay: "100ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "The AI Saree Atelier"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "reveal-up max-w-4xl font-serif text-6xl leading-[1.1] sm:text-7xl lg:text-9xl tracking-tight",
							style: { animationDelay: "300ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-primary",
								children: "Virtual Couture"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-foreground/90 italic mt-2",
								children: "draped for you."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "reveal-up max-w-xl text-base text-muted-foreground sm:text-lg",
							style: { animationDelay: "500ms" },
							children: "Hand-woven Kanjivarams, breathable cottons and cinematic georgettes — try each one on your own photo before you commit."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "reveal-up flex flex-wrap items-center gap-4",
							style: { animationDelay: "700ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#collection",
								className: "btn-gold inline-flex items-center gap-3 px-10 py-4 text-xs font-semibold tracking-[0.2em] uppercase",
								children: ["Explore the Collection", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80",
								children: "120+ curated drapes · Free virtual fitting"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "collection",
				className: "mx-auto max-w-7xl scroll-mt-24 px-5 pb-6 pt-4 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-6 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.32em] text-primary",
						children: "The Collection"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-serif text-3xl sm:text-4xl",
						children: "Saree Atelier"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden text-xs uppercase tracking-[0.24em] text-muted-foreground sm:block",
						children: [filtered.length, " pieces"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar flex gap-3 overflow-x-auto pb-2",
					children: [
						"All",
						"Silk",
						"Cotton",
						"Georgette"
					].map((c) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActive(c),
							className: `shrink-0 border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${c === active ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border hover:border-primary hover:text-primary"}`,
							children: c
						}, c);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-5 pb-24 pt-4 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
					children: filtered.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/saree/$id",
						params: { id: s.id },
						className: "group relative overflow-hidden glass-premium transition-all duration-700 hover:-translate-y-2",
						style: { animation: `reveal-up 0.8s ${i * 100}ms both` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[3/4] overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: s.image,
									alt: s.name,
									width: 768,
									height: 1024,
									loading: "lazy",
									className: "h-full w-full object-cover transition duration-1000 group-hover:scale-105"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute left-4 top-4 glass px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary rounded-full",
									children: s.category
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-end justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate font-serif text-3xl text-foreground",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-muted-foreground mt-1",
										children: s.subtitle
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "shrink-0 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-2xl text-primary",
										children: formatPrice(s.price)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-[0.2em] text-primary/80 mt-1",
										children: "Try-on ready"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
								children: ["View drape ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})]
						})]
					}, s.id))
				})
			})
		]
	});
}
//#endregion
export { Index as component };
