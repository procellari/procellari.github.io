import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
logo_svg = root / "images" / "og-logo-icon.svg"
logo_png = root / "images" / "og-logo-render.png"
out = root / "og-image.png"

if not logo_svg.exists():
    logo_svg = root / "images" / "og-logo-light.svg"

render_cmd = (
    f'npx --yes @resvg/resvg-js-cli --fit-width 900 '
    f'"{logo_svg}" "{logo_png}"'
)
subprocess.run(render_cmd, cwd=root, check=True, shell=True)

logo = Image.open(logo_png).convert("RGBA")

logo_size = 420
border_pad = 28
border_width = 6
border_color = "#0D1B3E"
border_radius = 24

box_size = logo_size + border_pad * 2
canvas = Image.new("RGB", (box_size, box_size), "#FFFFFF")

logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
logo_x = border_pad
logo_y = border_pad

draw = ImageDraw.Draw(canvas)
draw.rounded_rectangle(
    (0, 0, box_size - 1, box_size - 1),
    radius=border_radius,
    outline=border_color,
    width=border_width,
)

canvas_rgba = canvas.convert("RGBA")
canvas_rgba.paste(logo, (logo_x, logo_y), logo)
canvas_rgba.convert("RGB").save(out, format="PNG", optimize=True)
print(f"Generated {out} ({box_size}x{box_size}, {out.stat().st_size // 1024} KB)")
