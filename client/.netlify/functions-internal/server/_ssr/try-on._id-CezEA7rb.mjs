import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as LoaderCircle, i as Sparkles, n as Upload, o as RefreshCw, x as ArrowLeft, y as Camera } from "../_libs/lucide-react.mjs";
import { t as SiteNav } from "./site-nav-BHPKuwnK.mjs";
import { i as saveEntry, r as newId } from "./tryon-store-CwsnO9F2.mjs";
import { t as Route } from "./try-on._id-C_qU4Kvm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/try-on._id-CezEA7rb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}
async function composeTryOn(userPhoto, sareeImage) {
	const [user, saree] = await Promise.all([loadImage(userPhoto), loadImage(sareeImage)]);
	const W = 900;
	const H = 1200;
	const canvas = document.createElement("canvas");
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext("2d");
	const uR = user.width / user.height;
	const cR = W / H;
	let dw = W;
	let dh = H;
	let dx = 0;
	let dy = 0;
	if (uR > cR) {
		dh = H;
		dw = H * uR;
		dx = (W - dw) / 2;
	} else {
		dw = W;
		dh = W / uR;
		dy = (H - dh) / 2;
	}
	ctx.drawImage(user, dx, dy, dw, dh);
	const layer = document.createElement("canvas");
	layer.width = W;
	layer.height = H;
	const lctx = layer.getContext("2d");
	const sR = saree.width / saree.height;
	let sdw = W;
	let sdh = H;
	let sdx = 0;
	let sdy = 0;
	if (sR > cR) {
		sdh = H;
		sdw = H * sR;
		sdx = (W - sdw) / 2;
	} else {
		sdw = W;
		sdh = W / sR;
		sdy = (H - sdh) / 2;
	}
	lctx.drawImage(saree, sdx, sdy, sdw, sdh);
	const layerData = lctx.getImageData(0, 0, W, H);
	const ld = layerData.data;
	for (let i = 0; i < ld.length; i += 4) {
		const r = ld[i], g = ld[i + 1], b = ld[i + 2];
		if (r > 220 && g > 220 && b > 220) {
			const alpha = Math.max(0, Math.floor((255 - Math.max(r, g, b)) / 35 * 255));
			ld[i + 3] = Math.min(ld[i + 3], alpha);
		}
	}
	lctx.putImageData(layerData, 0, 0);
	const mask = document.createElement("canvas");
	mask.width = W;
	mask.height = H;
	const mctx = mask.getContext("2d");
	const grad = mctx.createLinearGradient(0, 0, 0, H);
	grad.addColorStop(0, "rgba(0,0,0,0)");
	grad.addColorStop(.32, "rgba(0,0,0,0)");
	grad.addColorStop(.46, "rgba(0,0,0,0.55)");
	grad.addColorStop(.6, "rgba(0,0,0,0.9)");
	grad.addColorStop(1, "rgba(0,0,0,1)");
	mctx.fillStyle = grad;
	mctx.fillRect(0, 0, W, H);
	const side = mctx.createLinearGradient(0, 0, W, 0);
	side.addColorStop(0, "rgba(0,0,0,0.15)");
	side.addColorStop(.15, "rgba(0,0,0,1)");
	side.addColorStop(.85, "rgba(0,0,0,1)");
	side.addColorStop(1, "rgba(0,0,0,0.15)");
	mctx.globalCompositeOperation = "destination-in";
	mctx.fillStyle = side;
	mctx.fillRect(0, 0, W, H);
	lctx.globalCompositeOperation = "destination-in";
	lctx.drawImage(mask, 0, 0);
	lctx.globalCompositeOperation = "source-over";
	ctx.globalAlpha = .92;
	ctx.globalCompositeOperation = "multiply";
	ctx.drawImage(layer, 0, 0);
	ctx.globalAlpha = .35;
	ctx.globalCompositeOperation = "overlay";
	ctx.drawImage(layer, 0, 0);
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "source-over";
	const vg = ctx.createRadialGradient(W / 2, H * .45, W * .25, W / 2, H * .55, W * .85);
	vg.addColorStop(0, "rgba(0,0,0,0)");
	vg.addColorStop(1, "rgba(20,4,10,0.55)");
	ctx.fillStyle = vg;
	ctx.fillRect(0, 0, W, H);
	const grain = ctx.getImageData(0, 0, W, H);
	const d = grain.data;
	for (let i = 0; i < d.length; i += 4) {
		const n = (Math.random() - .5) * 10;
		d[i] = Math.max(0, Math.min(255, d[i] + n));
		d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
		d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
	}
	ctx.putImageData(grain, 0, 0);
	return canvas.toDataURL("image/jpeg", .9);
}
function TryOn() {
	const { saree } = Route.useLoaderData();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("choose");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => stopCamera();
	}, []);
	function stopCamera() {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
	}
	async function startCamera() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 1280 },
					height: { ideal: 1280 }
				},
				audio: false
			});
			streamRef.current = stream;
			setMode("camera");
			requestAnimationFrame(() => {
				if (videoRef.current) videoRef.current.srcObject = stream;
			});
		} catch {
			alert("Camera access denied. Please upload a photo instead.");
		}
	}
	function capture() {
		const v = videoRef.current;
		const c = canvasRef.current;
		if (!v || !c) return;
		c.width = v.videoWidth;
		c.height = v.videoHeight;
		const ctx = c.getContext("2d");
		ctx.translate(c.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(v, 0, 0);
		setPhoto(c.toDataURL("image/jpeg", .9));
		stopCamera();
		setMode("preview");
	}
	function onFile(e) {
		const f = e.target.files?.[0];
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => {
			setPhoto(reader.result);
			setMode("preview");
		};
		reader.readAsDataURL(f);
	}
	async function submit() {
		if (!photo) return;
		setMode("processing");
		setProgress(0);
		const start = Date.now();
		const total = 3200;
		let resultPhoto = null;
		const composePromise = composeTryOn(photo, saree.image).then((r) => {
			resultPhoto = r;
		}).catch(() => {
			resultPhoto = photo;
		});
		const tick = setInterval(() => {
			const p = Math.min(100, (Date.now() - start) / total * 100);
			setProgress(p);
			if (p >= 100 && resultPhoto) {
				clearInterval(tick);
				const id = newId();
				saveEntry({
					id,
					sareeId: saree.id,
					sareeName: saree.name,
					sareeImage: saree.image,
					userPhoto: photo,
					resultPhoto,
					createdAt: Date.now()
				});
				navigate({
					to: "/result/$id",
					params: { id }
				});
			}
		}, 90);
		await composePromise;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-5 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/saree/$id",
					params: { id: saree.id },
					className: "inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Back to saree"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Virtual Fitting Room"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 font-serif text-4xl sm:text-5xl",
					children: ["Drape the ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold-gradient",
						children: saree.name
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Add a full-body photo — front facing, plain background works best."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass mt-8 overflow-hidden rounded-3xl p-6 sm:p-8",
					children: [
						mode === "choose" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => fileRef.current?.click(),
									className: "group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-10 text-center transition hover:border-primary hover:bg-primary/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:scale-105",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-xl",
										children: "Upload a photo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "JPG or PNG, up to 10 MB"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: startCamera,
									className: "group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-10 text-center transition hover:border-primary hover:bg-primary/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 transition group-hover:scale-105",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-xl",
										children: "Use camera"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Capture instantly with your device"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: onFile
								})
							]
						}),
						mode === "camera" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-full overflow-hidden rounded-2xl border border-border/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										ref: videoRef,
										autoPlay: true,
										playsInline: true,
										muted: true,
										className: "aspect-[3/4] w-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 ring-2 ring-inset ring-primary/30" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
									ref: canvasRef,
									className: "hidden"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											stopCamera();
											setMode("choose");
										},
										className: "rounded-full border border-border/70 px-5 py-2.5 text-sm hover:border-primary/60",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: capture,
										className: "btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }), " Capture"]
									})]
								})
							]
						}),
						mode === "preview" && photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative overflow-hidden rounded-2xl border border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: photo,
									alt: "Your photo",
									className: "max-h-[60vh] object-contain"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setPhoto(null);
										setMode("choose");
									},
									className: "inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-sm hover:border-primary/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), " Retake"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: submit,
									className: "btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-[0.16em] uppercase",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Generate try-on"]
								})]
							})]
						}),
						mode === "processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-8 py-8 reveal-up",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-full max-w-sm overflow-hidden border border-border bg-card p-2 shadow-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative overflow-hidden bg-card/40",
										children: [
											photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: photo,
												alt: "Processing",
												className: "w-full max-h-[50vh] object-contain opacity-90 contrast-[1.05]"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scan-line absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-transparent via-primary/10 to-primary/30 border-b border-primary shadow-[0_4px_20px_rgba(122,16,34,0.2)]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute top-4 right-4 grid h-10 w-10 place-items-center bg-card border border-border shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-3xl text-primary animate-pulse",
										children: "AI Synthesis"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground",
										children: progress < 35 ? "Analysing body topology..." : progress < 70 ? "Draping virtual fabric..." : "Matching ambient lighting..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full max-w-md relative mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1 overflow-hidden bg-border/40 shadow-inner",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-primary transition-all duration-300 ease-out relative",
											style: { width: `${progress}%` },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 h-full w-4 bg-white/40 blur-[2px]" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex justify-between text-[10px] uppercase tracking-[0.3em] text-primary/70 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Processing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-primary font-bold text-xs",
											children: [Math.round(progress), "%"]
										})]
									})]
								})
							]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { TryOn as component };
