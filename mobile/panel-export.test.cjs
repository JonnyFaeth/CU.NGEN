const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const P=require('./panels');
// Execute the actual browser export handlers. DOM stubs only supply controls and capture downloads.
function harness(){
 const elements={},events={},downloads=[],blobs=new Map();
 function el(id){return elements[id]??=( {value:'',hidden:false,addEventListener(type,fn){this[type]=fn;},set innerHTML(s){this.html=s;for(const m of s.matchAll(/id="([^"]+)"[^>]*?(?:value="([^"]*)")?[^>]*>/g)){const e=el(m[1]);const v=m[0].match(/value="([^"]*)"/);if(v)e.value=v[1];}},get innerHTML(){return this.html||'';}} );}
 const html=fs.readFileSync(__dirname+'/index.html','utf8');
 for(const m of html.matchAll(/<input\b[^>]*>/g)){const id=m[0].match(/id="([^"]+)"/),v=m[0].match(/value="([^"]*)"/);if(id)el(id[1]).value=v?.[1]||'';}
 el('panelStyle').value='horizontal';el('panelStock').value='square';
 vm.runInNewContext(fs.readFileSync(__dirname+'/panels-ui.js','utf8'),{CUPanels:P,CUJourney:require('./journey'),localStorage:{getItem:k=>blobs.get('storage-'+k),setItem:(k,v)=>blobs.set('storage-'+k,v)},document:{getElementById:el,createElement(){return {click(){downloads.push({name:this.download,blob:blobs.get(this.href)});}};}},window:{addEventListener:(n,f)=>events[n]=f},Blob,TextEncoder,DataView,Uint8Array,Intl,URL:{createObjectURL(b){const u=String(blobs.size);blobs.set(u,b);return u;},revokeObjectURL(){}},setTimeout(){}});
 return {el,events,downloads};
}
async function exported(h){h.el('panelPackage').onclick();const bytes=Buffer.from(await h.downloads.at(-1).blob.arrayBuffer()),files={};let i=0;
 while(bytes.readUInt32LE(i)===0x04034b50){const size=bytes.readUInt32LE(i+18),n=bytes.readUInt16LE(i+26),extra=bytes.readUInt16LE(i+28),name=bytes.subarray(i+30,i+30+n).toString();i+=30+n+extra;files[name]=bytes.subarray(i,i+size).toString();i+=size;}
 return files;
}
test('9 inch planning envelope exports matching geometry, parts, paper, guide and quote',async()=>{
 const h=harness();h.events['cu-ceiling-capture']({detail:{measurementSource:'user-entered-approximate',fixture:{diameterMm:393.7,projectionMm:228.6}}});
 const files=await exported(h),d=JSON.parse(files['design.json']),b=JSON.parse(files['parts-list.json']),guide=files['assembly-guide.html'];
 assert.equal(d.measurementSource,'user-entered-approximate');assert.ok(guide.includes('user-entered-approximate'));assert.equal(d.input.projection,228.6);assert.equal(d.frame.height,256.6);assert.equal(d.sheets.length,3);assert.equal(d.quote.knownTotal,76.96);
 assert.equal(d.manufacturingReady,false);assert.equal(b.manufacturingReady,false);assert.deepEqual(b.quote,d.quote);
 assert.ok(h.el('panelResult').innerHTML.includes('$76.96'));assert.ok(guide.includes('$76.96'));assert.ok(!guide.includes('21.06'));
 assert.equal(b.stock.woodSheets,3);assert.equal(b.stock.paperRolls,1);assert.equal(b.panels.length,5);
 for(const p of d.panels){assert.equal(files[`panel-${p.id}-${p.name.toLowerCase()}.svg`],P.svg(p));const part=b.panels.find(x=>x.id===p.id);assert.equal(part.width,p.width);assert.equal(part.height,p.height);assert.equal(part.paper.width,p.paper.width);assert.equal(part.paper.height,p.paper.height);assert.ok(guide.includes(p.paper.id));assert.ok(files['paper-roll-1.svg'].includes(`data-part-id="${p.paper.id}"`));}
 d.sheets.forEach((s,i)=>assert.equal(files[`wood-sheet-${i+1}.svg`],P.sheetSvg(s)));
 for(const unknown of d.quote.unknown)assert.ok(guide.includes(unknown));
 assert.ok(guide.includes('four-wall ring'));assert.ok(guide.includes('eight bottom tabs'));assert.equal(d.panels[4].slots.length,8);
});
test('sample exports retain sample label; custom prices and stock propagate to guide',async()=>{
 const h=harness();h.el('panelDemo').onclick();h.el('panelStock').value='custom';h.el('panelStock').change();
 let files=await exported(h);assert.equal(JSON.parse(files['design.json']).exampleOnly,true);assert.ok(files['assembly-guide.html'].includes('SYNTHETIC EXAMPLE'));assert.ok(files['assembly-guide.html'].includes('Custom stock'));
 h.el('pc-wood').value='12.34';h.el('pc-wood').input();files=await exported(h);assert.equal(JSON.parse(files['design.json']).quote.lines.find(l=>l.key==='wood').unitPrice,12.34);assert.ok(files['assembly-guide.html'].includes('$24.68'));
});
module.exports={harness,exported};

for(const style of ['plain','horizontal','stepped'])for(const stock of ['square','long'])for(const projection of [100,228.6]){
 test(`complete quote journey: ${style}, ${stock}, projection ${projection}`,async()=>{
  const h=harness();h.events['cu-ceiling-capture']({detail:{measurementSource:'user-entered-approximate',fixture:{diameterMm:393.7,projectionMm:projection}}});
  h.el('choose-'+style).onclick();h.el('panelStock').value=stock;h.el('panelStock').change();
  h.el('panelClearance').value='30';h.el('panelClearance').input();
  h.el('saveCeiling').onclick();h.el('panelClearance').value='40';h.el('panelClearance').input();h.el('restoreCeiling').onclick();
  const files=await exported(h),d=JSON.parse(files['design.json']),parts=JSON.parse(files['parts-list.json']);
  assert.equal(d.input.style,style);assert.equal(d.input.clearance,30);assert.equal(d.input.projection,projection);assert.equal(d.quote.stockOption,stock);
  assert.deepEqual(require('../simulations/design-audit.cjs').audit(d),{pass:true,failures:[]});
  assert.deepEqual(parts.quote,d.quote);assert.equal(parts.stock.woodSheets,d.sheets.length);
  for(const p of d.panels){assert.equal(files[`panel-${p.id}-${p.name.toLowerCase()}.svg`],P.svg(p));const item=parts.panels.find(a=>a.id===p.id);assert.equal(item.width,p.width);assert.equal(item.height,p.height);assert.equal(item.paper.width,p.paper.width);assert.equal(item.paper.height,p.paper.height);}
  assert.ok(files['assembly-guide.html'].includes('$'+d.quote.knownTotal.toFixed(2)));
  for(const unknown of d.quote.unknown)assert.ok(files['assembly-guide.html'].includes(unknown));
  h.el('prepareCeilingReview').onclick();assert.equal(h.downloads.at(-1).name,'CU-design-review.zip');
  const request=Buffer.from(await h.downloads.at(-1).blob.arrayBuffer());assert.ok(request.includes(Buffer.from('draft-review-request')));assert.ok(request.includes(Buffer.from('No paid work authorized')));
  assert.equal(d.quote.orderable,false);assert.equal(d.manufacturingReady,false);
 });
}
test('customer chooses, saves, restores and prepares the same design for review',async()=>{
 const h=harness();h.events['cu-ceiling-capture']({detail:{measurementSource:'user-entered-approximate',fixture:{diameterMm:393.7,projectionMm:228.6}}});
 h.el('choose-stepped').onclick();assert.equal(h.el('panelStyle').value,'stepped');h.el('saveCeiling').onclick();
 h.el('choose-plain').onclick();h.el('restoreCeiling').onclick();assert.equal(h.el('panelStyle').value,'stepped');
 h.el('prepareCeilingReview').onclick();assert.equal(h.downloads.at(-1).name,'CU-design-review.zip');
 const b=Buffer.from(await h.downloads.at(-1).blob.arrayBuffer());assert.ok(b.includes(Buffer.from('quote-request.json')));assert.ok(b.includes(Buffer.from('draft-review-request')));assert.ok(b.includes(Buffer.from('No paid work authorized')));
 assert.ok(h.el('ceilingRequestStatus').textContent.includes('not an order'));
 h.el('panelThickness').value='0';h.el('panelThickness').input();assert.equal(h.el('prepareCeilingReview').onclick,null);
});
