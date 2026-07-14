import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ArrowRight, d as Mail, g as Facebook, i as Sparkles, p as Instagram, r as Twitter } from "../_libs/lucide-react.mjs";
import { t as Route$3 } from "./result._id-C-HxgHA4.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as Route$4 } from "./try-on._id-C_qU4Kvm.mjs";
import { t as Route$5 } from "./saree._id-D5_ahWJM.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-3LpQQgXJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BnWjfD6D.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function Footer() {
	const [email, setEmail] = (0, import_react.useState)("");
	const handleSubscribe = (e) => {
		e.preventDefault();
		if (!email) return;
		toast.success("Thank you for subscribing to Virtual Couture!");
		setEmail("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative mt-24 border-t border-border/40 bg-background/50 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[1000px] rounded-[100%] bg-primary/5 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:pt-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-12 lg:gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-6 lg:col-span-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "group flex items-center gap-3 w-fit",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-12 w-12 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/40 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-105 group-hover:shadow-[0_0_20px_var(--gold)/30]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary transition-transform duration-500 group-hover:rotate-12" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "leading-tight",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-2xl text-gold-gradient transition-all duration-500 group-hover:brightness-125",
										children: "Virtual Couture"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-[0.24em] text-muted-foreground mt-1",
										children: "AI Saree Atelier"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-md text-sm leading-relaxed text-muted-foreground",
								children: "Experience the luxury of virtual draping. We combine state-of-the-art AI with the finest traditional weaves to let you try on breathtaking sarees from anywhere in the world."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4 mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLink, {
										href: "#",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }),
										label: "Instagram"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLink, {
										href: "#",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-4 w-4" }),
										label: "Twitter"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLink, {
										href: "#",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" }),
										label: "Facebook"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-8 lg:col-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-lg text-foreground",
								children: "Collection"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex flex-col gap-3 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "All Sarees"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "Kanjivaram Silk"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "Soft Cotton"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "Designer Georgette"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-lg text-foreground",
								children: "Assistance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex flex-col gap-3 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "Virtual Fitting Guide"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "Style Advice"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "Contact Us"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterLink, {
										to: "/",
										children: "FAQs"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 lg:col-span-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-lg text-foreground",
								children: "The Inner Circle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Subscribe to receive exclusive access to new seasonal drapes and private AI styling sessions."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubscribe,
								className: "mt-2 relative flex items-center group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-y-0 left-4 grid place-items-center text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "Your email address",
										className: "w-full rounded-full border border-border/60 bg-card/40 py-3.5 pl-12 pr-32 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/60 focus:bg-card/60 focus:ring-4 focus:ring-primary/5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "btn-gold absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-5 text-[10px] font-bold uppercase tracking-[0.2em]",
										children: "Subscribe"
									})
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-8 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground tracking-wide",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Virtual Couture. Crafted for the modern connoisseur."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-6 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "transition hover:text-primary",
						children: "Privacy Policy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "transition hover:text-primary",
						children: "Terms of Service"
					})]
				})]
			})]
		})]
	});
}
function SocialLink({ href, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		"aria-label": label,
		target: "_blank",
		rel: "noreferrer",
		className: "grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card/30 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
		children: icon
	});
}
function FooterLink({ to, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group flex items-center gap-2 transition-colors hover:text-primary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "-translate-x-2 transition-transform duration-300 group-hover:translate-x-0",
			children
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$2 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Virtual Couture — AI Saree Try-On Atelier" },
			{
				name: "description",
				content: "An AI-powered saree virtual try-on boutique. Drape hand-picked silks, cottons and georgettes over your own photo in seconds."
			},
			{
				name: "author",
				content: "Virtual Couture"
			},
			{
				property: "og:title",
				content: "Virtual Couture — AI Saree Try-On Atelier"
			},
			{
				property: "og:description",
				content: "An AI-powered saree virtual try-on boutique. Drape hand-picked silks, cottons and georgettes over your own photo in seconds."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Virtual Couture — AI Saree Try-On Atelier"
			},
			{
				name: "twitter:description",
				content: "An AI-powered saree virtual try-on boutique. Drape hand-picked silks, cottons and georgettes over your own photo in seconds."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/42212a63-6604-4187-bd2e-70ce71548e0e/id-preview-4f843c85--fde4afb9-0d9e-4e07-b548-0eb192ec97aa.lovable.app-1783333690290.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/42212a63-6604-4187-bd2e-70ce71548e0e/id-preview-4f843c85--fde4afb9-0d9e-4e07-b548-0eb192ec97aa.lovable.app-1783333690290.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$2.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		let timeoutId;
		const resetTimeout = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				router.navigate({ to: "/" });
			}, 12e4);
		};
		const events = [
			"mousemove",
			"keydown",
			"scroll",
			"touchstart",
			"click"
		];
		let lastActivityTime = Date.now();
		const handleUserActivity = () => {
			const now = Date.now();
			if (now - lastActivityTime > 1e3) {
				lastActivityTime = now;
				resetTimeout();
			}
		};
		events.forEach((event) => {
			window.addEventListener(event, handleUserActivity, { passive: true });
		});
		resetTimeout();
		return () => {
			clearTimeout(timeoutId);
			events.forEach((event) => {
				window.removeEventListener(event, handleUserActivity);
			});
		};
	}, [router]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var $$splitComponentImporter$1 = () => import("./history-B0dHdHGi.mjs");
var Route$1 = createFileRoute("/history")({
	head: () => ({ meta: [
		{ title: "Try-On History — Virtual Couture" },
		{
			name: "description",
			content: "Every saree you've virtually tried on, saved for you."
		},
		{
			property: "og:title",
			content: "Try-On History — Virtual Couture"
		},
		{
			property: "og:description",
			content: "Every saree you've virtually tried on, saved for you."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-p2SLcWGt.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var HistoryRoute = Route$1.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => Route$2
});
var IndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$2
});
var TryOnIdRoute = Route$4.update({
	id: "/try-on/$id",
	path: "/try-on/$id",
	getParentRoute: () => Route$2
});
var SareeIdRoute = Route$5.update({
	id: "/saree/$id",
	path: "/saree/$id",
	getParentRoute: () => Route$2
});
var rootRouteChildren = {
	IndexRoute,
	HistoryRoute,
	ResultIdRoute: Route$3.update({
		id: "/result/$id",
		path: "/result/$id",
		getParentRoute: () => Route$2
	}),
	SareeIdRoute,
	TryOnIdRoute
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
