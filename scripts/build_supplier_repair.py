"""Re-export the frozen 100 mm RFQ geometry. Requires ezdxf, reportlab, pypdf."""
import json, math, hashlib, zipfile
from pathlib import Path
import ezdxf
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from pypdf import PdfReader
from pypdf.generic import ContentStream

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'procurement'/'ceiling-sample-compatible'
OUT.mkdir(parents=True,exist_ok=True)
source=ROOT/'procurement'/'ceiling-sample'/'design.json'
d=json.loads(source.read_text())
t,f=d['input']['thickness'],d['input']['fit']
def rect(x,y,w,h): return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]]
parts=d['panels']+[
 {'id':'coupon-tab','width':60,'height':30+t,'outer':[[0,0],[60,0],[60,30],[40,30],[40,30+t],[20,30+t],[20,30],[0,30]],'slots':[],'windows':[]},
 {'id':'coupon-slot','width':60,'height':30,'outer':rect(0,0,60,30),'slots':[rect(20-f/2,15-(t+f)/2,20+f,t+f)],'windows':[]},
]
pdf=canvas.Canvas(str(OUT/'CU-original-RFQ-full-scale.pdf'),pageCompression=1)
pdf.setTitle('CU original RFQ - pricing only - seven full-scale vector pages')
results=[]
for number,p in enumerate(parts,1):
 polygons=[p['outer'],*p['slots'],*p['windows']]
 contours=[[(x,p['height']-y) for x,y in poly] for poly in polygons]
 expected_length=sum(math.dist(poly[i],poly[(i+1)%len(poly)]) for poly in contours for i in range(len(poly)))
 for version in ['R2010','R12']:
  doc=ezdxf.new(version)
  if version=='R2010':doc.units=4
  doc.layers.new('CUT',dxfattribs={'color':7})
  space=doc.modelspace()
  for poly in contours:
   if version=='R2010':space.add_lwpolyline(poly,close=True,dxfattribs={'layer':'CUT'})
   else:
    for a,b in zip(poly,poly[1:]+poly[:1]):space.add_line(a,b,dxfattribs={'layer':'CUT'})
  name=f"{p['id']}_{'r2010' if version=='R2010' else 'r12_lines'}.dxf"
  doc.set_modelspace_vport(height=p['height']+20,center=(p['width']/2,p['height']/2))
  doc.saveas(OUT/name)
  reopened=ezdxf.readfile(OUT/name)
  audit=reopened.audit();assert not audit.errors and not audit.fixes,(name,audit.errors,audit.fixes)
  entities=list(reopened.modelspace());assert len(entities)==(len(polygons) if version=='R2010' else sum(map(len,polygons)))
  actual=[]
  for e in entities:
   if version=='R2010':
    assert e.closed
    pts=[tuple(v) for v in e.get_points('xy')];actual.extend(zip(pts,pts[1:]+pts[:1]))
   else:actual.append((tuple(e.dxf.start)[:2],tuple(e.dxf.end)[:2]))
  expected=[(a,b) for poly in contours for a,b in zip(poly,poly[1:]+poly[:1])]
  assert len(actual)==len(expected)
  for observed,wanted in zip(actual,expected):
   for a,b in zip(observed,wanted):assert math.dist(a,b)<1e-7
  assert abs(sum(math.dist(a,b) for a,b in actual)-expected_length)<1e-6
 pdf.setPageSize(((p['width']+20)*mm,(p['height']+20)*mm))
 pdf.bookmarkPage(p['id']);pdf.addOutlineEntry(f"{number}. {p['id']} - quantity 1",p['id'],0)
 pdf.setStrokeColorRGB(0,0,0);pdf.setLineWidth(.1)
 for poly in contours:
  drawing=pdf.beginPath();drawing.moveTo((poly[0][0]+10)*mm,(poly[0][1]+10)*mm)
  for x,y in poly[1:]:drawing.lineTo((x+10)*mm,(y+10)*mm)
  drawing.close();pdf.drawPath(drawing,stroke=1,fill=0)
 pdf.showPage()
 results.append({'page':number,'part':p['id'],'quantity':1,'widthMm':p['width'],'heightMm':p['height'],'contours':len(contours),'cutLengthMm':expected_length})
pdf.save()
reader=PdfReader(OUT/'CU-original-RFQ-full-scale.pdf');assert len(reader.pages)==len(parts)
for page,p in zip(reader.pages,parts):
 assert abs(float(page.mediabox.width)-(p['width']+20)*mm)<.001
 assert abs(float(page.mediabox.height)-(p['height']+20)*mm)<.001
 assert not list(page.images)
 expected=[((x+10)*mm,(p['height']-y+10)*mm) for poly in [p['outer'],*p['slots'],*p['windows']] for x,y in poly]
 ops=ContentStream(page.get_contents(),reader).operations
 actual=[tuple(float(v) for v in operands) for operands,operator in ops if operator in [b'm',b'l']]
 assert len(actual)==len(expected)
 assert all(math.dist(a,b)<.001 for a,b in zip(actual,expected))
 assert sum(operator==b'h' for _,operator in ops)==1+len(p['slots'])+len(p['windows'])
report={'sourceSHA256':hashlib.sha256(source.read_bytes()).hexdigest(),'geometryChanged':False,'sourceProjectionMm':100,'sourceThicknessMm':t,'units':'mm','manufacturingReady':False,'verification':'DXF library read-back, clean audit, every segment and perimeter match; PDF page sizes and every vector coordinate match','pages':results}
(OUT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
readme='''CU ORIGINAL RFQ - COMPATIBILITY RE-EXPORT - PRICING ONLY

Geometry is unchanged from the original RFQ: nominal 3.175 mm stock,
100 mm SYNTHETIC fixture projection, largest panel E 474.05 x 474.05 mm.
This is not the newer nine-inch planning design. No paid work is authorized.

Use ONE format only, not all alternatives:
- CU-original-RFQ-full-scale.pdf: seven vector pages at 1:1 in millimeters.
  Each page has a 10 mm margin around the part envelope. No text or raster
  images are embedded in the cutting pages. Bookmarks identify the parts.
  Do not scale to fit a printer or artboard. Check E measures 474.05 mm.
- *_r2010.dxf: model-space closed LWPOLYLINE contours, CUT layer, mm units.
- *_r12_lines.dxf: separate LINE segments for legacy import. Set import
  units to MILLIMETERS manually. Join coincident endpoints if required.

Page order / quantity per set: A, B, C, D, E, coupon-tab, coupon-slot;
one of each. A/B match each other; C/D match each other.
Finished geometry only. Supplier applies calibrated kerf compensation.
Internal contours first. Coupon and material/joint verification required.
Mounting and final dimensions remain unresolved. DO NOT MANUFACTURE.

Verified in ezdxf 1.4.5 and pypdf. Supplier CAM compatibility is not yet
confirmed. Please report CAD/CAM software and import errors if it fails.
'''
(OUT/'READ-ME.txt').write_text(readme)
archive=ROOT/'procurement'/'CU-original-RFQ-compatible.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for file in sorted(OUT.iterdir()):
  if file.suffix in ['.pdf','.dxf','.json','.txt']:z.write(file,file.name)
print(json.dumps({'folder':str(OUT),'archive':str(archive),'parts':len(parts),'pdfPages':len(reader.pages),'validated':True}))
