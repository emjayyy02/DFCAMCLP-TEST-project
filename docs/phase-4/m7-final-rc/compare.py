"""Create review sheets pairing FD1 baseline and M7 golden screenshots."""

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


root = Path.cwd()
out = root / "docs/phase-4/m7-final-rc/golden"
baseline = root / "final-check-before-uiux"
states = sorted(json.loads((out / "manifest.json").read_text())["captures"], key=lambda state: state["golden"])
font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 17)


def image_for(state, files_key, size, suffix, base):
    relative = next(
        filename
        for filename in state[files_key]
        if filename.startswith(size) and filename.endswith(suffix)
    )
    return Image.open(base / relative).convert("RGB")


for start in range(0, len(states), 3):
    sheet = Image.new("RGB", (1710, 1310), "#e3e8ef")
    draw = ImageDraw.Draw(sheet)
    for row, state in enumerate(states[start : start + 3]):
        top = row * 435
        draw.text((10, top + 4), f"{state['golden']} | {state['state']}", font=font, fill="#17233b")
        for key, size, suffix, base, x, width in [
            ("before", "desktop-1920x1080", "--viewport.png", baseline, 10, 600),
            ("after", "desktop-1920x1080", "--viewport.png", out, 620, 600),
            ("before", "mobile-375x812", "--viewport.png", baseline, 1230, 230),
            ("after", "mobile-375x812", "--viewport.png", out, 1470, 230),
        ]:
            item = image_for(state, key, size, suffix, base)
            item = item.resize((width, round(item.height * width / item.width)))
            sheet.paste(item, (x, top + 30))
    sheet.save(out / f"comparison-{start // 3 + 1:02}.jpg", quality=88)

print(f"{len(states)} paired states across {(len(states) + 2) // 3} sheets")
