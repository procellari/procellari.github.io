import base64
import io
import re
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
svg = (root / "images" / "logo.svg").read_text(encoding="utf-8")
match = re.search(r'xlink:href="data:image/png;base64,([^"]+)"', svg)
if not match:
    raise SystemExit("No embedded PNG in logo.svg")

img = Image.open(io.BytesIO(base64.b64decode(match.group(1)))).convert("RGBA")

bbox = img.getbbox()
if bbox:
    x0, y0, x1, y1 = bbox
    width, height = x1 - x0, y1 - y0
    side = max(width, height)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    left = max(0, cx - side // 2)
    top = max(0, cy - side // 2)
    img = img.crop((left, top, left + side, top + side))

(root / "favicon.svg").write_text(svg, encoding="utf-8")
img.resize((512, 512), Image.Resampling.LANCZOS).save(root / "apple-touch-icon.png", format="PNG")
img.resize((32, 32), Image.Resampling.LANCZOS).save(root / "favicon-32x32.png", format="PNG")
img.resize((16, 16), Image.Resampling.LANCZOS).save(root / "favicon-16x16.png", format="PNG")
img.resize((48, 48), Image.Resampling.LANCZOS).save(
    root / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
)

print("Generated favicon assets")
