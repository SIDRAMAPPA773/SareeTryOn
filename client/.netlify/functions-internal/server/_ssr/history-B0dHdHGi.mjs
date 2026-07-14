import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ArrowRight, h as History, i as Sparkles } from "../_libs/lucide-react.mjs";
import { t as SiteNav } from "./site-nav-BHPKuwnK.mjs";
import { n as getHistory } from "./tryon-store-CwsnO9F2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-B0dHdHGi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => setItems(getHistory()), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5 py-10 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5" }), " Your fittings"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 font-serif text-4xl sm:text-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold-gradient",
						children: "Try-On"
					}), " History"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Every drape you've virtually tried, ready to revisit."
				}),
				items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass mt-10 flex flex-col items-center gap-4 rounded-3xl p-14 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-2xl",
							children: "No fittings yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm text-sm text-muted-foreground",
							children: "Head to the atelier and try on your first saree — it'll appear here."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "btn-gold mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-[0.16em] uppercase",
							children: ["Explore collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
					children: items.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/result/$id",
						params: { id: e.id },
						className: "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/30",
						style: { animation: `float-up 0.6s ${i * 40}ms both` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[3/4]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: e.resultPhoto || e.sareeImage,
									alt: e.sareeName,
									className: "h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: e.userPhoto,
									alt: "",
									className: "absolute bottom-3 right-3 h-16 w-16 rounded-full border-2 border-primary/70 object-cover shadow-lg"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-serif text-lg",
								children: e.sareeName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
								children: new Date(e.createdAt).toLocaleDateString()
							})]
						})]
					}, e.id))
				})
			]
		})]
	});
}
//#endregion
export { HistoryPage as component };
