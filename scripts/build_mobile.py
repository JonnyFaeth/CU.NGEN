"""Build the free phone web app without third-party dependencies."""
from pathlib import Path
import shutil
import zipfile
import struct
import zlib
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist'/'mobile'
OUT.mkdir(parents=True,exist_ok=True)
for file in (ROOT/'mobile').iterdir():
    if file.is_file() and not file.name.endswith('.test.cjs'):
        shutil.copyfile(file,OUT/file.name)
shutil.copyfile(ROOT/'app/engine.js',OUT/'engine.js')
ui=(ROOT/'app/app.js').read_text(encoding='utf-8')
start=ui.index('function diagram(')
end=ui.index('function stepsHTML(')
view="(function(){const mm=n=>`${Number(n.toFixed(1))} mm`;\n"+ui[start:end]+"\nwindow.CUView={diagram,assembly,stepIcon};})();\n"
(OUT/'view.js').write_text(view,encoding='utf-8')
# Original geometric icon rendered with the standard library; no external assets.
def icon(size):
    rows=[]
    for y in range(size):
        row=bytearray([0])
        for x in range(size):
            u,v=x/size,y/size
            color=(51,78,59)
            if .27<u<.73 and .17<v<.82:color=(188,156,104)
            if .31<u<.69 and .21<v<.78:color=(238,225,188)
            if .48<u<.52 and .17<v<.82:color=(188,156,104)
            row.extend(color)
        rows.append(bytes(row))
    def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(rows)))+chunk(b'IEND',b'')
for size in [180,192,512]:(OUT/f'icon-{size}.png').write_bytes(icon(size))
archive=ROOT/'dist'/'CU-NGEN-Mobile-0.3.0.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for file in sorted(OUT.iterdir()):
        if file.is_file():z.write(file,'CU-NGEN-Mobile/'+file.name)
print(str(OUT))
print(str(archive))
