/* Five physical panels. Millimeters. Finished boundaries, CNC laser only. */
(function(root){'use strict';
const n=(v,name,min,max)=>{if(v===''||v==null||!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)throw Error(`${name}: enter ${min}–${max}.`);return Number(v);};
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1];},0)/2);
const length=p=>p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+Math.hypot(a[0]-b[0],a[1]-b[1]);},0);
function pack(parts,w,h,gap=5,margin=8){
 const sheets=[];for(const p of [...parts].sort((a,b)=>b.height-a.height||b.width-a.width)){
  if(p.width>w-2*margin||p.height>h-2*margin)throw Error(`${p.id} does not fit the selected stock. Increase stock size or reduce design dimensions.`);
  let done=false;for(const s of sheets){for(const row of s.rows){if(p.height<=row.height&&row.end+p.width<=w-margin){s.items.push({...p,x:row.end,y:row.y});row.end+=p.width+gap;done=true;break;}}if(done)break;
   const y=s.rows.length?s.rows.at(-1).y+s.rows.at(-1).height+gap:margin;if(y+p.height<=h-margin){s.rows.push({y,height:p.height,end:margin+p.width+gap});s.items.push({...p,x:margin,y});done=true;break;}}
  if(!done)sheets.push({rows:[{y:margin,height:p.height,end:margin+p.width+gap}],items:[{...p,x:margin,y:margin}]});
 }return sheets.map(s=>({width:w,height:h,items:s.items}));
}
function generate(input){
 const diameter=n(input.diameter,'Fixture diameter',50,1200),projection=n(input.projection,'Ceiling projection',20,600),clearance=n(input.clearance??25,'Side spacing',10,100),bottomClearance=n(input.bottomClearance??25,'Bottom spacing',10,100),t=n(input.thickness??3,'Measured thickness',2,6),fit=n(input.fit??.15,'Total slot allowance',0,.6);
 const style=input.style||'horizontal';if(!['plain','horizontal','stepped'].includes(style))throw Error('Unknown panel style.');
 const I=diameter+2*clearance,H=projection+bottomClearance,b=Math.max(12,3*t),border=Math.max(16,4*t),W=I+2*t+2*b,D=I+2*t;
 if(H<2*border+25||I<2*border+40)throw Error('Enclosure is too small for the panel borders and joints. Increase spacing.');
 const tab=Math.min(24,I/6),cornerTab=Math.min(24,H/6),ys=[.3*H,.7*H],f=fit/2;
 function wall(id,side){
  const body=side?I:W,off=side?t:0,outer=[[off,0],[off+body,0]];
  if(side)for(const y of ys){outer.push([off+body,y-cornerTab/2],[off+body+t,y-cornerTab/2],[off+body+t,y+cornerTab/2],[off+body,y+cornerTab/2]);}
  outer.push([off+body,H]);for(const x of [.7*body,.3*body])outer.push([off+x+tab/2,H],[off+x+tab/2,H+t],[off+x-tab/2,H+t],[off+x-tab/2,H]);outer.push([off,H]);
  if(side)for(const y of [...ys].reverse())outer.push([off,y+cornerTab/2],[0,y+cornerTab/2],[0,y-cornerTab/2],[off,y-cornerTab/2]);
  const slots=[];if(!side)for(const x of [b,W-b-t])for(const y of ys)slots.push(rect(x-f,y-cornerTab/2-f,t+fit,cornerTab+fit));
  const x=side?t+border:b+t+border,windowW=I-2*border,windowH=H-2*border,windows=[];const count=style==='plain'?1:style==='horizontal'?5:4,rib=8,cell=(windowH-(count-1)*rib)/count;
  if(cell<8)throw Error('Panels are too short for this rib pattern. Use Plain or increase bottom spacing.');
  for(let i=0;i<count;i++){const inset=style==='stepped'?Math.abs(i-(count-1)/2)*8:0;windows.push(rect(x+inset,border+i*(cell+rib),windowW-2*inset,cell));}
  return {id,name:side?(id==='C'?'Left':'Right'):(id==='A'?'Front':'Back'),width:side?D:W,height:H+t,outer,slots,windows,paper:{id:'paper-'+id,width:windowW+12,height:windowH+12,x:x-6,y:border-6}};
 }
 const panels=[wall('A',false),wall('B',false),wall('C',true),wall('D',true)];
 const slots=[];for(const y of [b,W-b-t])for(const x of [.3*W,.7*W])slots.push(rect(x-tab/2-f,y-f,tab+fit,t+fit));
 for(const x of [b,W-b-t])for(const y of [b+t+.3*I,b+t+.7*I])slots.push(rect(x-f,y-tab/2-f,t+fit,tab+fit));
 const win=I-2*border,origin=b+t+border,cell=(win-8)/2,windows=[];for(const x of [origin,origin+cell+8])for(const y of [origin,origin+cell+8])windows.push(rect(x,y,cell,cell));
 panels.push({id:'E',name:'Bottom',width:W,height:W,outer:rect(0,0,W,W),slots,windows,paper:{id:'paper-E',width:win+12,height:win+12,x:origin-6,y:origin-6}});
 const sw=n(input.sheetWidth??609.6,'Wood sheet width',100,2500),sh=n(input.sheetHeight??609.6,'Wood sheet height',100,2500);
 const sheets=pack(panels,sw,sh),paper=pack(panels.map(p=>p.paper),939.8,3581.4,5,8);
 const netArea=panels.reduce((sum,p)=>sum+area(p.outer)-[...p.slots,...p.windows].reduce((s,r)=>s+area(r),0),0);
 return {schema:'cu-five-panel',version:1,process:'CNC laser; finished geometry; supplier CAM kerf compensation required',input:{diameter,projection,clearance,bottomClearance,thickness:t,fit,style,sheetWidth:sw,sheetHeight:sh},frame:{width:W,depth:W,height:H+t,interiorWidth:I,interiorDepth:I,interiorHeight:H,wallHeight:H,inset:b,border},panels,sheets,paperRolls:paper,paperCutouts:panels.map(p=>p.paper),netWoodAreaMm2:netArea,cutLengthMm:panels.reduce((s,p)=>s+[p.outer,...p.slots,...p.windows].reduce((v,r)=>v+length(r),0),0),joint:{baseTabWidth:tab,cornerTabHeight:cornerTab,tabDepth:t,totalSlotAllowance:fit,cornerCentersFromTop:ys},manufacturingReady:false,mountingStatus:'unresolved'};
}
const fmt=n=>String(Math.round(n*1000)/1000);
function paths(p){return [p.outer,...p.slots,...p.windows].map(poly=>`<path d="M${poly.map(a=>a.map(fmt).join(',')).join(' L')} Z"/>`).join('');}
function svg(p){return `<svg xmlns="http://www.w3.org/2000/svg" width="${fmt(p.width)}mm" height="${fmt(p.height)}mm" viewBox="0 0 ${fmt(p.width)} ${fmt(p.height)}"><title>Panel ${p.id}; finished geometry; CAM kerf compensation required; laser only</title><g fill="none" stroke="black" stroke-width="0.05">${paths(p)}</g></svg>`;}
function sheetSvg(s){return `<svg xmlns="http://www.w3.org/2000/svg" width="${fmt(s.width)}mm" height="${fmt(s.height)}mm" viewBox="0 0 ${fmt(s.width)} ${fmt(s.height)}"><title>Finished panel boundaries in mm. Internal cuts first; CAM kerf compensation required. Not G-code.</title><g fill="none" stroke="black" stroke-width="0.05">${s.items.map(p=>`<g id="panel-${p.id}" transform="translate(${fmt(p.x)} ${fmt(p.y)})">${paths(p)}</g>`).join('')}</g></svg>`;}
function coupon(d){const t=d.input.thickness,fit=d.input.fit;const male={id:'coupon-tab',width:40,height:30+t,outer:[[0,0],[40,0],[40,30],[30,30],[30,30+t],[10,30+t],[10,30],[0,30]],slots:[],windows:[]},female={id:'coupon-slot',width:40,height:30,outer:rect(0,0,40,30),slots:[rect(10-fit/2,15-(t+fit)/2,20+fit,t+fit)],windows:[]};return sheetSvg({width:100,height:50,items:[{...male,x:5,y:5},{...female,x:55,y:5}]});}
function quote(d,c={}){
 const lines=[],unknown=[];function add(key,label,qty,defaultPrice){const v=Object.hasOwn(c,key)?c[key]:defaultPrice;if(v==null||v===''){unknown.push(label);return;}const price=n(v,label,0,100000);lines.push({key,label,quantity:qty,unitPrice:price,total:Math.round(qty*Math.round(price*100))/100});}
 add('wood','Wood stock sheets',d.sheets.length,21.06);add('paper','Kozo paper rolls',d.paperRolls.length,39.99);
 for(const [k,label] of [['woodGlue','Wood adhesive'],['paperGlue','Paper adhesive'],['mounting','Ceiling attachment'],['fabrication','CNC setup, cutting and fit coupon'],['packaging','Packaging'],['handling','Handling']])add(k,label,1,null);
 const baseCents=lines.reduce((s,l)=>s+Math.round(l.total*100),0),fee=Math.round(baseCents*.1);let total=baseCents+fee;
 for(const k of ['shipping','tax']){if(c[k]==null||c[k]==='')unknown.push(k);else{const value=n(c[k],k,0,100000);total+=Math.round(value*100);lines.push({key:k,label:k,quantity:1,unitPrice:value,total:Math.round(value*100)/100});}}
 return {lines,knownTotal:total/100,cuFee:fee/100,unknown,firm:false,orderable:false,woodListingStatus:'Reference listing unavailable on 2026-10-20; supplier quote required',priceDate:'2026-10-20'};
}
const api={generate,svg,sheetSvg,coupon,quote,pack,area};if(typeof module==='object'&&module.exports)module.exports=api;else root.CUPanels=api;
})(typeof window==='object'?window:globalThis);
