"""Index only the current focused release captures; preserve historical evidence."""

import html
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parent
captures = sorted(
    path
    for path in root.rglob("*.png")
    if not {"visual-review", "before-text-fix"}.intersection(path.relative_to(root).parts)
)
review = root / "visual-review"
review.mkdir(exist_ok=True)
sheets = []
for start in range(0, len(captures), 8):
    sheet = Image.new("RGB", (1640, 1240), "#edf0f4")
    draw = ImageDraw.Draw(sheet)
    entries = []
    for offset, capture in enumerate(captures[start : start + 8]):
        relative = capture.relative_to(root).as_posix()
        with Image.open(capture) as original:
            size = list(original.size)
            thumbnail = ImageOps.contain(original.convert("RGB"), (390, 560))
        left, top = (offset % 4) * 410, (offset // 4) * 620
        draw.rectangle((left + 5, top + 5, left + 405, top + 615), fill="white")
        sheet.paste(thumbnail, (left + (410 - thumbnail.width) // 2, top + 45))
        draw.text((left + 12, top + 12), f"{start + offset + 1}: {relative}", fill="#122b51")
        entries.append({"index": start + offset + 1, "path": relative, "size": size})
    name = f"sheet-{len(sheets) + 1:02d}.jpg"
    sheet.save(review / name, quality=90)
    sheets.append({"sheet": name, "entries": entries})

manifest = {"images": len(captures), "sheets": sheets}
(root / "focused-screenshot-manifest.json").write_text(
    json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
)
figures = []
for capture in captures:
    relative = html.escape(capture.relative_to(root).as_posix(), quote=True)
    figures.append(
        f'<figure><a href="{relative}"><img src="{relative}" loading="lazy" '
        f'alt="Release capture: {relative}"></a><figcaption>{relative}</figcaption></figure>'
    )
sheet_links = " ".join(
    f'<a href="visual-review/{s["sheet"]}">{i + 1}</a>' for i, s in enumerate(sheets)
)
(root / "index.html").write_text(
    '<!doctype html><html lang="en"><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    '<title>Focused public demo release evidence</title><style>'
    'body{font:16px system-ui;background:#edf0f4;color:#122b51;margin:24px}'
    'main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:24px}'
    'figure{margin:0;background:white;padding:12px;min-width:0}'
    'img{display:block;width:100%;max-height:640px;object-fit:contain}'
    'figcaption{overflow-wrap:anywhere;margin-top:12px}a{color:#1024cc}'
    '</style><h1>Focused public demo release evidence</h1>'
    f'<p>{len(captures)} current screenshots. Select a capture for its full-size image. '
    'Failing diagnostic captures are separately preserved in before-text-fix and excluded here.</p>'
    f'<p>Review contact sheets: {sheet_links}</p>'
    '<p><a href="../P4-PUBLIC-DEMO-RELEASE-CHECK.md">Release report</a> · '
    '<a href="../../../final-check-pass-4/index.html">Original complete gallery</a></p>'
    '<main>' + "".join(figures) + '</main></html>\n',
    encoding="utf-8",
)
print(f"Focused gallery refreshed: {len(captures)} screenshots, {len(sheets)} sheets.")
