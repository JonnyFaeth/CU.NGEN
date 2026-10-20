// Public sample for supplier review only; not a fitted or approved ceiling kit.
'use strict';
const fs=require('node:fs'),path=require('node:path');
const P=require('../mobile/panels.js');
const out=path.resolve(__dirname,'../procurement/ceiling-sample');
fs.mkdirSync(out,{recursive:true});
const d=P.generate({diameter:393.7,projection:100,thickness:3.175,fit:.15,style:'horizontal'});
d.quoteContext={status:'SAMPLE ONLY - DO NOT MANUFACTURE',diameter:'Rough user measurement; not verified',
 projection:'Synthetic 100 mm; actual ceiling projection unknown',
 thickness:'Nominal 1/8 inch; regenerate after supplier confirms actual stock',
 mounting:'Not designed or included in panel files'};
fs.writeFileSync(path.join(out,'design.json'),JSON.stringify(d,null,2)+'\n');
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const t=d.input.thickness,f=d.input.fit;
const coupons=[
 {id:'coupon-tab',width:60,height:30+t,outer:[[0,0],[60,0],[60,30],[40,30],[40,30+t],[20,30+t],[20,30],[0,30]],slots:[],windows:[]},
 {id:'coupon-slot',width:60,height:30,outer:rect(0,0,60,30),slots:[rect(20-f/2,15-(t+f)/2,20+f,t+f)],windows:[]}
];
// ASCII R2000 DXF: one part, closed lightweight polylines, millimeters.
function dxf(p){
 const a=[];const put=(...v)=>a.push(...v.map(String));
 put(0,'SECTION',2,'HEADER',9,'$ACADVER',1,'AC1015',9,'$INSUNITS',70,4,0,'ENDSEC',
     0,'SECTION',2,'ENTITIES');
 for(const polygon of [p.outer,...p.slots,...p.windows]){
  put(0,'LWPOLYLINE',100,'AcDbEntity',8,'0',100,'AcDbPolyline',90,polygon.length,70,1);
  // Flip SVG's downwards Y into CAD's upwards Y without changing part geometry.
  for(const [x,y] of polygon)put(10,+x.toFixed(6),20,+(p.height-y).toFixed(6));
 }
 put(0,'ENDSEC',0,'EOF');return a.join('\n')+'\n';
}
for(const p of [...d.panels,...coupons]){
 fs.writeFileSync(path.join(out,`${p.id}.svg`),P.svg(p)+'\n');
 fs.writeFileSync(path.join(out,`${p.id}.dxf`),dxf(p));
}
console.log(JSON.stringify({output:out,frame:d.frame,panels:d.panels.map(p=>({id:p.id,width:p.width,height:p.height})),cutLengthMm:d.cutLengthMm},null,2));
