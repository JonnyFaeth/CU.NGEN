"""Bundle the same tested web engine in the native iPhone app; no remote runtime."""
from pathlib import Path
import runpy, shutil
root=Path(__file__).resolve().parents[1]
runpy.run_path(str(root/'scripts/build_mobile.py'))
shutil.copytree(root/'dist/mobile',root/'ios/Web',dirs_exist_ok=True)
print('Native web bundle ready in ios/Web')
