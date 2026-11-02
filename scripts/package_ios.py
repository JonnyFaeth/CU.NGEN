"""Package an iphoneos build for local re-signing; this does not sign or install it."""
from pathlib import Path
import plistlib, zipfile, hashlib
root=Path(__file__).resolve().parents[1]
app=root/'ios/device-build/Build/Products/Debug-iphoneos/CULantern.app'
with (app/'Info.plist').open('rb') as f: info=plistlib.load(f)
if 'iPhoneOS' not in info.get('CFBundleSupportedPlatforms',[]): raise SystemExit('Refusing a simulator app: requires an iphoneos build.')
if not (app/info['CFBundleExecutable']).is_file(): raise SystemExit('Missing application executable.')
version=info['CFBundleShortVersionString']
out=root/'dist'/f'CU-Lantern-{version}-unsigned.ipa'
out.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for file in sorted(app.rglob('*')):
  if file.is_file():z.write(file,'Payload/CULantern.app/'+file.relative_to(app).as_posix())
digest=hashlib.sha256(out.read_bytes()).hexdigest()
(out.with_suffix('.ipa.sha256')).write_text(digest+'  '+out.name+'\n')
print(out)
print('UNSIGNED: requires local signing. Not an App Store or TestFlight release.')
