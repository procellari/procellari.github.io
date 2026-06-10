import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

root = Path(__file__).resolve().parents[1]
logo_svg = root / "images" / "og-logo-light.svg"
logo_png = root / "images" / "og-logo-render.png"
out = root / "og-image.png"

if not logo_svg.exists():
    logo_svg = root / "Orignal Logo - Light Mode.svg"

render_cmd = (
    f'npx --yes @resvg/resvg-js-cli --fit-width 900 '
    f'"{logo_svg}" "{logo_png}"'
)
subprocess.run(render_cmd, cwd=root, check=True, shell=True)

logo = Image.open(logo_png).convert("RGBA")

canvas_w, canvas_h = 1200, 630
canvas = Image.new("RGB", (canvas_w, canvas_h), "#0A1628")
draw = ImageDraw.Draw(canvas)

for y in range(canvas_h):
    ratio = y / canvas_h
    color = (
        int(10 + ratio * 8),
        int(22 + ratio * 12),
        int(40 + ratio * 20),
    )
    draw.line([(0, y), (canvas_w, y)], fill=color)

glow = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse((300, 20, 900, 610), fill=(30, 144, 255, 50))
glow = glow.filter(ImageFilter.GaussianBlur(90))
canvas = Image.alpha_composite(canvas.convert("RGBA"), glow)

logo_size = 480
logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
logo_x = (canvas_w - logo_size) // 2
logo_y = (canvas_h - logo_size) // 2
canvas.paste(logo, (logo_x, logo_y), logo)

canvas.convert("RGB").save(out, format="PNG", optimize=True)
print(f"Generated {out} ({out.stat().st_size // 1024} KB) from {logo_svg.name}")
