"""Keep current gallery labels and summary synchronized with the final manifest."""
from pathlib import Path
import json

root = Path('final-check-pass-4')
manifest = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
validation_path = Path('final-pass-4-evidence/corpus-verification.json')
validation = json.loads(validation_path.read_text(encoding='utf-8'))
validation['postCaptureIntegrity'] = manifest['postCaptureIntegrity']
validation_path.write_text(json.dumps(validation, indent=2), encoding='utf-8')
index = root / 'index.html'
text = index.read_text(encoding='utf-8')
text = text.replace('Final check before UI/UX', 'Final check — Pass 4')
text = text.replace('mobile 390×844, 375×812, and 360×800.', 'mobile 390×844, 375×812, 360×800 and 320×812.')
text = text.replace('Application source unchanged.', 'Captured after the approved Final Pass 4 changes. Historical evidence preserved separately.')
index.write_text(text, encoding='utf-8')
(root / 'README.md').write_text(f'''# Final check — Pass 4

Open index.html to browse the separate current screenshot collection.

- {len(manifest['captures'])} views; {manifest['totalPNGs']} PNGs.
- Eight widths: 320, 360, 375, 390, 768, 1024, 1440 and 1920px.
- Viewport captures, full-page captures, and lower content in scrolling dialogs.
- All nine demo accounts use isolated sessions and the existing real login endpoint.
- Capture failures: {len(manifest['failures'])}. Page overflow and missing-image checks: zero.
- Historical `final-check-before-uiux` evidence is preserved separately.
- Chromium production preview on port 3001; no physical-device or Safari claim.
- See `../final-pass-4-evidence/README.md`, `corpus-verification.json`, and `visual-review.md` for validation and review coverage.

The raw capture integrity log records Next type generation updating `next-env.d.ts` during capture. This generated reference was restored; the post-capture integrity check matches all {manifest['postCaptureIntegrity']['checkedFiles']} original capture-baseline files. Application source did not change during capture.
''', encoding='utf-8')
