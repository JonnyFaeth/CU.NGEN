"""Build reproducible offline Lantern Studio artifacts from a strict file allowlist."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / 'app'
VERSION = '0.2.0'
FILES = ['index.html', 'styles.css', 'engine.js', 'app.js', 'START-HERE.txt', 'README.md', 'TESTING.md']


def build(out):
    out.mkdir(parents=True, exist_ok=True)
    html = (APP / 'index.html').read_text(encoding='utf-8')
    html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + (APP / 'styles.css').read_text(encoding='utf-8') + '</style>')
    for name in ['engine.js', 'app.js']:
        html = html.replace(f'<script src="{name}"></script>', '<script>' + (APP / name).read_text(encoding='utf-8') + '</script>')
    single = out / f'CU-NGEN-Lantern-Studio-{VERSION}.html'
    single.write_text(html, encoding='utf-8', newline='\n')
    archive = out / f'CU-NGEN-Lantern-Studio-{VERSION}.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for name in FILES:
            data = (APP / name).read_bytes()
            info = zipfile.ZipInfo('CU-NGEN-Lantern-Studio/' + name, (2026, 10, 17, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data)
        for name in ['LICENSING.md']:
            info = zipfile.ZipInfo('CU-NGEN-Lantern-Studio/' + name, (2026, 10, 17, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, (ROOT / name).read_bytes())
    manifest = {p.name: {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in [single, archive]}
    (out / 'SHA256SUMS.txt').write_text(''.join(f'{v["sha256"]}  {k}\n' for k, v in manifest.items()), encoding='utf-8')
    print(json.dumps(manifest, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=ROOT / 'dist')
    build(parser.parse_args().out)
