"""Compare the separate final capture with its historical coverage contract."""
from pathlib import Path
from PIL import Image
import json
from urllib.parse import urlsplit

root = Path('final-check-pass-4')
current = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
previous = json.loads(Path('final-check-before-uiux/manifest.json').read_text(encoding='utf-8'))

def key(capture):
    url = urlsplit(capture['url'])
    return (capture['group'], capture['label'], url.path, url.query, capture.get('state', ''))

current_keys = {key(c) for c in current['captures']}
missing_states = [list(key(c)) for c in previous['captures'] if key(c) not in current_keys]
missing_images = []
dimension_errors = []
overflow = []
files = []
for capture in current['captures']:
    for name, metric in capture.items():
        if isinstance(metric, dict) and 'viewport' in metric:
            if metric['width'] > metric['viewport']:
                overflow.append({'capture': capture['id'], 'matrix': name, **metric})
            if metric.get('missingImages'):
                missing_images.append({'capture': capture['id'], 'matrix': name, 'images': metric['missingImages']})
    for filename in capture['files']:
        files.append(filename)
        with Image.open(root / filename) as img:
            img.load()
            expected = capture['dimensions'][filename]
            if list(img.size) != [expected['width'], expected['height']]:
                dimension_errors.append(filename)

result = {
    'historicalViews': len(previous['captures']),
    'historicalImages': sum(len(c['files']) for c in previous['captures']),
    'currentViews': len(current['captures']),
    'currentImages': len(files),
    'accounts': current['accounts'],
    'missingHistoricalStates': missing_states,
    'captureFailures': current['failures'],
    'pageOverflow': overflow,
    'missingImages': missing_images,
    'invalidDimensions': dimension_errors,
    'sourceIntegrity': current.get('sourceIntegrity'),
    'postCaptureIntegrity': current.get('postCaptureIntegrity'),
}
Path('final-pass-4-evidence/corpus-verification.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps({k: v for k, v in result.items() if k not in ['accounts', 'pageOverflow']}, indent=2))
print('Page overflow findings:', len(overflow))
assert len(current['accounts']) == 9
assert all(a['loginStatus'] == 200 for a in current['accounts'])
assert not missing_states and not current['failures'] and not overflow and not missing_images and not dimension_errors
