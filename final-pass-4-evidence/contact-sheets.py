from pathlib import Path
from PIL import Image, ImageDraw
import json, hashlib, sys

source = Path(sys.argv[1])
output = Path(sys.argv[2])
output.mkdir(parents=True, exist_ok=True)
manifest = json.loads((source / 'manifest.json').read_text(encoding='utf-8'))
files = [f for c in manifest['captures'] for f in c['files']]
groups = {}
for f in files:
    data = (source / f).read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    groups.setdefault(digest, []).append(f)
items = list(groups.values())
first_sheet = int(sys.argv[3]) if len(sys.argv) > 3 else 1
mapping = json.loads((output / 'review-map.json').read_text(encoding='utf-8'))['sheets'][:first_sheet - 1] if first_sheet > 1 else []
for start in range((first_sheet - 1) * 70, len(items), 70):
    sheet = Image.new('RGB', (1470, 1800), '#dde3ec')
    draw = ImageDraw.Draw(sheet)
    entries = []
    for index, duplicates in enumerate(items[start:start + 70]):
        f = duplicates[0]
        with Image.open(source / f) as original:
            original.load()
            thumb = original.convert('RGB')
            thumb.thumbnail((202, 153))
            x, y = (index % 7) * 210, (index // 7) * 180
            sheet.paste(thumb, (x + (210 - thumb.width) // 2, y + 20))
            draw.text((x + 4, y + 2), str(start + index + 1) + ' ' + f.split('/')[0], fill='#182338')
            entries.append({'index': start + index + 1, 'path': f, 'duplicates': duplicates, 'size': list(original.size)})
    name = f'sheet-{start // 70 + 1:03}.jpg'
    sheet.save(output / name, quality=90)
    mapping.append({'sheet': name, 'entries': entries})
    print(name, flush=True)
(output / 'review-map.json').write_text(json.dumps({'source': str(source), 'paths': len(files), 'unique': len(items), 'sheets': mapping}, indent=2), encoding='utf-8')
print(json.dumps({'paths': len(files), 'unique': len(items), 'sheets': len(mapping)}))
