// Canvas-based try-on compositor. Blends a saree fabric onto the lower ~60%
// of the user's photo using a soft mask + multiply blend, then adds a
// warm vignette and film grain so the output reads as a photograph
// rather than a placeholder.

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function composeTryOn(
  userPhoto: string,
  sareeImage: string,
): Promise<string> {
  const [user, saree] = await Promise.all([
    loadImage(userPhoto),
    loadImage(sareeImage),
  ]);

  // Portrait 3:4 canvas, cover-fit the user photo.
  const W = 900;
  const H = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Draw user photo cover-fit
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

  // Build the drape layer on an offscreen canvas: saree fabric masked by a
  // soft gradient that fades in around the torso and covers the lower body.
  const layer = document.createElement("canvas");
  layer.width = W;
  layer.height = H;
  const lctx = layer.getContext("2d")!;

  // Cover-fit saree onto layer, sample the pattern-rich lower area.
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

  // Remove white background so it doesn't wash out the user photo
  const layerData = lctx.getImageData(0, 0, W, H);
  const ld = layerData.data;
  for (let i = 0; i < ld.length; i += 4) {
    const r = ld[i], g = ld[i + 1], b = ld[i + 2];
    // Threshold for white-ish background
    if (r > 220 && g > 220 && b > 220) {
      const maxVal = Math.max(r, g, b);
      // Map 220->255 to alpha 255->0
      const alpha = Math.max(0, Math.floor(((255 - maxVal) / 35) * 255));
      ld[i + 3] = Math.min(ld[i + 3], alpha);
    }
  }
  lctx.putImageData(layerData, 0, 0);


  // Soft mask: transparent at top, opaque from ~38% down, feathered edges.
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const mctx = mask.getContext("2d")!;
  const grad = mctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0.0, "rgba(0,0,0,0)");
  grad.addColorStop(0.32, "rgba(0,0,0,0)");
  grad.addColorStop(0.46, "rgba(0,0,0,0.55)");
  grad.addColorStop(0.6, "rgba(0,0,0,0.9)");
  grad.addColorStop(1.0, "rgba(0,0,0,1)");
  mctx.fillStyle = grad;
  mctx.fillRect(0, 0, W, H);
  // Feather the sides so the drape doesn't bleed to the edges harshly
  const side = mctx.createLinearGradient(0, 0, W, 0);
  side.addColorStop(0, "rgba(0,0,0,0.15)");
  side.addColorStop(0.15, "rgba(0,0,0,1)");
  side.addColorStop(0.85, "rgba(0,0,0,1)");
  side.addColorStop(1, "rgba(0,0,0,0.15)");
  mctx.globalCompositeOperation = "destination-in";
  mctx.fillStyle = side;
  mctx.fillRect(0, 0, W, H);

  // Apply mask to the fabric layer
  lctx.globalCompositeOperation = "destination-in";
  lctx.drawImage(mask, 0, 0);
  lctx.globalCompositeOperation = "source-over";

  // Multiply the draped fabric over the user photo, then a softer overlay
  // pass to keep pattern detail visible.
  ctx.globalAlpha = 0.92;
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(layer, 0, 0);
  ctx.globalAlpha = 0.35;
  ctx.globalCompositeOperation = "overlay";
  ctx.drawImage(layer, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  // Warm vignette for an editorial finish
  const vg = ctx.createRadialGradient(W / 2, H * 0.45, W * 0.25, W / 2, H * 0.55, W * 0.85);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(20,4,10,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grain to break the CGI-clean look
  const grain = ctx.getImageData(0, 0, W, H);
  const d = grain.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  return canvas.toDataURL("image/jpeg", 0.9);
}