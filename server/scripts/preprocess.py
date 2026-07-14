"""
scripts/preprocess.py
======================
Self-contained Python script to handle background removal (via rembg)
and image enhancement (PIL) before sending to Meshy.
Prints the final base64 data URI to stdout.
"""

import os
import sys
import io
import base64
from PIL import Image, ImageEnhance, ImageFilter

def remove_background(image_path):
    try:
        from rembg import remove
    except ImportError:
        raise ImportError("rembg is not installed. Run: pip install rembg")

    with open(image_path, "rb") as f:
        raw = f.read()

    result_bytes = remove(raw)
    img = Image.open(io.BytesIO(result_bytes)).convert("RGBA")
    return img

def preprocess_image(image_path, min_size=1040, sharpen=2.0, contrast=1.3, color_boost=1.2, perform_bg_removal=True):
    # 1. Background removal if requested
    if perform_bg_removal:
        try:
            img = remove_background(image_path)
        except Exception as e:
            print(f"Background removal failed, falling back to original: {e}", file=sys.stderr)
            img = Image.open(image_path)
    else:
        img = Image.open(image_path)

    if img.mode == "RGBA":
        pass
    else:
        img = img.convert("RGB")

    # 2. Resize (maintain aspect ratio, ensure min dimension)
    w, h = img.size
    if w < min_size or h < min_size:
        scale = min_size / min(w, h)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 3. Convert to RGB for enhancement
    img_rgb = img.convert("RGB")

    # 4. Noise reduction
    img_rgb = img_rgb.filter(ImageFilter.MedianFilter(size=3))

    # 5. Sharpness
    img_rgb = ImageEnhance.Sharpness(img_rgb).enhance(sharpen)

    # 6. Contrast
    img_rgb = ImageEnhance.Contrast(img_rgb).enhance(contrast)

    # 7. Color boost
    img_rgb = ImageEnhance.Color(img_rgb).enhance(color_boost)

    # 8. Restore Alpha if RGBA
    if img.mode == "RGBA":
        r, g, b = img_rgb.split()
        _, _, _, a = img.split()
        if a.size != r.size:
            a = a.resize(r.size, Image.Resampling.LANCZOS)
        final_img = Image.merge("RGBA", (r, g, b, a))
        mime = "image/png"
        fmt = "PNG"
    else:
        final_img = img_rgb
        mime = "image/png"
        fmt = "PNG"

    # 9. Encode to base64 Data URI
    buffer = io.BytesIO()
    final_img.save(buffer, format=fmt)
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    data_uri = f"data:{mime};base64,{b64_str}"

    return data_uri

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python preprocess.py <image_path> [remove_bg=1/0]", file=sys.stderr)
        sys.exit(1)
        
    img_path = sys.argv[1]
    remove_bg = True
    if len(sys.argv) > 2:
        remove_bg = sys.argv[2].lower() in ("true", "1", "yes")

    try:
        data_uri = preprocess_image(img_path, perform_bg_removal=remove_bg)
        # Print only the data URI to stdout
        print(data_uri)
    except Exception as e:
        print(f"Error during preprocessing: {e}", file=sys.stderr)
        sys.exit(1)
