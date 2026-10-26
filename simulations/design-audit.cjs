'use strict';
// Independent checks on exported geometry; does not call the panel generator.
const eps=1e-6;
const bounds=p=>({x:Math.min(...p.map(v=>v[0])),y:Math.min(...p.map(v=>v[1])),right:Math.max(...p.map(v=>v[0])),bottom:Math.max(...p.map(v=>v[1]))});
const overlaps=(a,b)=>Math.min(a.right,b.right)>Math.max(a.x,b.x)+eps&&Math.min(a.bottom,b.bottom)>Math.max(a.y,b.y)+eps;
function inside(poly,[x,y]){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
const box=p=>({x:p.x,y:p.y,right:p.x+p.width,bottom:p.y+p.height});
function audit(d){
 const failures=[];const check=(ok,msg)=>{if(!ok)failures.push(msg);};
 const close=(a,b)=>Math.abs(a-b)<eps;
 check(d.panels.length===5&&d.panels.map(p=>p.id).join('')==='ABCDE','five uniquely identified panels');
 check(d.frame.interiorWidth>=d.input.diameter+2*d.input.clearance-eps,'side spacing');
 check(d.frame.interiorHeight>=d.input.projection+d.input.bottomClearance-eps,'bottom spacing');
 let perimeter=0;
 for(const p of d.panels){
  const holes=[...p.slots,...p.windows];
  for(const poly of [p.outer,...holes]){
   check(poly.length>=4&&poly.every(v=>v.length===2&&v.every(Number.isFinite)),p.id+' finite polygon');
   for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];check(close(a[0],b[0])||close(a[1],b[1]),p.id+' orthogonal edge');const len=Math.hypot(a[0]-b[0],a[1]-b[1]);check(len>eps,p.id+' nonzero edge');perimeter+=len;}
   const b=bounds(poly);check(b.x>=-eps&&b.y>=-eps&&b.right<=p.width+eps&&b.bottom<=p.height+eps,p.id+' contour bounds');
  }
  for(const h of holes)check(h.every(v=>inside(p.outer,v)),p.id+' hole inside wood');
  for(let i=0;i<holes.length;i++)for(let j=i+1;j<holes.length;j++)check(!overlaps(bounds(holes[i]),bounds(holes[j])),p.id+' distinct holes');
  const paper=box(p.paper);
  for(const w of p.windows){const b=bounds(w);check(b.x>=paper.x+6-eps&&b.y>=paper.y+6-eps&&b.right<=paper.right-6+eps&&b.bottom<=paper.bottom-6+eps,p.id+' paper overlap at least 6 mm');}
  for(const s of p.slots)check(!overlaps(paper,bounds(s)),p.id+' paper clear of joint');
 }
 check(close(perimeter,d.cutLengthMm),'cut perimeter matches geometry');
 for(const [name,sheets,expected] of [['wood',d.sheets,d.panels],['paper',d.paperRolls,d.paperCutouts]]){
  const placed=sheets.flatMap(s=>s.items);check(placed.length===expected.length,name+' complete parts');
  for(const p of expected){const matches=placed.filter(a=>a.id===p.id);check(matches.length===1&&close(matches[0].width,p.width)&&close(matches[0].height,p.height),name+' unique matching '+p.id);}
  for(const s of sheets){for(const p of s.items)check(p.x>=8-eps&&p.y>=8-eps&&p.x+p.width<=s.width-8+eps&&p.y+p.height<=s.height-8+eps,name+' stock margin');
   for(let i=0;i<s.items.length;i++)for(let j=i+1;j<s.items.length;j++){const a=box(s.items[i]),b=box(s.items[j]);check(a.right+5<=b.x+eps||b.right+5<=a.x+eps||a.bottom+5<=b.y+eps||b.bottom+5<=a.y+eps,name+' 5 mm part separation');}}
 }
 // Assemble wall tabs into bottom-plane coordinates, then match every tab to one slot.
 const t=d.input.thickness,f=d.input.fit,b=d.frame.inset,W=d.frame.width,H=d.frame.wallHeight;
 const tabs=[];
 for(const p of d.panels.slice(0,4))for(let i=0;i<p.outer.length;i++){
  const a=p.outer[i],z=p.outer[(i+1)%p.outer.length];
  if(close(a[1],H+t)&&close(z[1],H+t)){
   const x=Math.min(a[0],z[0]),len=Math.abs(a[0]-z[0]);
   tabs.push(['A','B'].includes(p.id)?{x,y:p.id==='A'?b:W-b-t,right:x+len,bottom:(p.id==='A'?b:W-b-t)+t}:{x:p.id==='C'?b:W-b-t,y:b+x,right:(p.id==='C'?b:W-b-t)+t,bottom:b+x+len});
  }
 }
 const slots=d.panels[4].slots.map(bounds);check(tabs.length===8&&slots.length===8,'eight base joints');
 for(const tab of tabs)check(slots.filter(s=>close(s.x,tab.x-f/2)&&close(s.y,tab.y-f/2)&&close(s.right,tab.right+f/2)&&close(s.bottom,tab.bottom+f/2)).length===1,'base slot matches assembled tab');
 // Side-wall vertical tab ends must align to front/back slots after assembly.
 for(const side of d.panels.slice(2,4))for(const edgeX of [0,side.width]){
  const intervals=[];
  for(let i=0;i<side.outer.length;i++){const a=side.outer[i],z=side.outer[(i+1)%side.outer.length];if(close(a[0],edgeX)&&close(z[0],edgeX)&&!close(a[1],z[1]))intervals.push([Math.min(a[1],z[1]),Math.max(a[1],z[1])]);}
  check(intervals.length===2,'two corner tabs per edge');
  const receiving=d.panels[edgeX===0?0:1],x=side.id==='C'?b:W-b-t;
  for(const [lo,hi] of intervals)check(receiving.slots.map(bounds).filter(s=>close(s.x,x-f/2)&&close(s.right,x+t+f/2)&&close(s.y,lo-f/2)&&close(s.bottom,hi+f/2)).length===1,'corner slot matches assembled tab');
 }
 check(d.manufacturingReady===false&&d.mountingStatus==='unresolved','physical validation remains pending');
 return {pass:failures.length===0,failures:[...new Set(failures)]};
}
module.exports={audit};
