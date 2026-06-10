import re
from html import unescape
from pathlib import Path

SITE_URL = "https://procellari.com"
OG_IMAGE = f"{SITE_URL}/og-image.png"

root = Path(__file__).resolve().parents[1]

for html_path in sorted(root.glob("*.html")):
    if html_path.name.startswith("google"):
        continue

    content = html_path.read_text(encoding="utf-8")
    if 'property="og:image"' in content:
        continue

    title_match = re.search(r"<title>(.*?)</title>", content, re.DOTALL)
    desc_match = re.search(r'<meta name="description" content="(.*?)">', content)
    if not title_match or not desc_match:
        print(f"Skip {html_path.name}: missing title or description")
        continue

    title = unescape(title_match.group(1).strip())
    description = unescape(desc_match.group(1).strip())

    if html_path.name == "index.html":
        page_url = f"{SITE_URL}/"
    else:
        page_url = f"{SITE_URL}/{html_path.name}"

    social_block = f"""  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Procellari">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{page_url}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Procellari — IT Solutions &amp; Digital Transformation">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{OG_IMAGE}">
"""

    content = re.sub(
        r'(<meta name="description" content=".*?">)',
        r"\1\n" + social_block.rstrip("\n"),
        content,
        count=1,
    )
    html_path.write_text(content, encoding="utf-8")
    print(f"Updated {html_path.name}")
