'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const P=require('../mobile/panels'),S=require('../mobile/scan'),J=require('../mobile/journey'),{audit}=require('./design-audit.cjs');
const out=path.join(__dirname,'benchmark-results');fs.mkdirSync(out,{recursive:true});
const M=require('../mobile/measurement');
const report={schema:'cu-validation-benchmark',version:1,referencePriceDate:'2026-10-20',limitations:['Synthetic images are not real-world scan accuracy evidence.','No automatic metric reconstruction or model training is performed.','User fixture dimensions are approximate, not ground truth.','No physical fit, mounting, thermal, load or longevity certification.','Reference prices are not refreshed supplier quotes.','Customer workflow runs real handlers in a DOM test harness, not an iPhone browser.'],sourceHashes:{}};
for(const name of ['panels','scan','journey','panels-ui','measurement'])report.sourceHashes[name]=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../mobile',name+'.js'))).digest('hex');
report.designs=[];
for(const diameter of [80,150,250,393.7,500,650])for(const projection of [40,100,228.6,400])for(const thickness of [2,3,3.175,6])for(const style of ['plain','horizontal','stepped']){
 const input={diameter,projection,thickness,style,sheetWidth:1000,sheetHeight:1500};
 try{const d=P.generate(input);report.designs.push({input,status:'generated',...audit(d)});}catch(e){report.designs.push({input,status:'rejected',reason:e.message});}
}
report.measurement={fixture:{diameterMm:393.7,projectionMm:228.6,source:'user approximate; no accuracy claim'},sensitivity:[]};
report.planarMeasurement=[];
for(const width of [60,80,120])for(const perspective of [0,.001])for(const noisePx of [0,1,3]){
 const truth={width,height:140},project=([x,y])=>[(x+200)/(1+perspective*x+.002*y),(y+100)/(1+perspective*x+.002*y)];
 const points=[[0,0],[100,0],[100,100],[0,100],[120,0],[120+width,140]].map(project).map((p,i)=>p.map((v,j)=>v+noisePx*Math.sin(i*7+j*11)));
 try{const measured=M.measure(points,100,100);report.planarMeasurement.push({truth,perspective,noisePx,measured,maxAbsoluteErrorMm:Math.max(Math.abs(measured.width-width),Math.abs(measured.height-140)),pass:noisePx===0?Math.abs(measured.width-width)<=1&&Math.abs(measured.height-140)<=1:null});}catch(e){report.planarMeasurement.push({truth,perspective,noisePx,rejected:e.message,pass:noisePx===0?false:null});}
}
for(const delta of [-20,-10,0,10,20]){const d=P.generate({diameter:393.7+delta,projection:228.6+delta});report.measurement.sensitivity.push({inputErrorMm:delta,outerWidthMm:d.frame.width,outerHeightMm:d.frame.height,remainingSideSpaceAgainstReferenceMm:(d.frame.interiorWidth-393.7)/2,remainingBottomSpaceAgainstReferenceMm:d.frame.interiorHeight-228.6});}
report.costs=[];
for(const projection of [100,228.6])for(const style of ['plain','horizontal','stepped'])for(const stock of [{id:'square',w:604.8248,h:604.8248,price:9.99},{id:'long',w:604.8248,h:1214.4248,price:31.99}]){
 const d=P.generate({diameter:393.7,projection,style,sheetWidth:stock.w,sheetHeight:stock.h});const q=P.quote(d,{wood:stock.price,stockOption:stock.id});
 report.costs.push({projectionMm:projection,style,stock:stock.id,sheets:d.sheets.length,paperRolls:d.paperRolls.length,panelCutMeters:Number((d.cutLengthMm/1000).toFixed(3)),knownSubtotalUSD:q.knownTotal,feeUSD:q.cuFee,unknown:q.unknown,firm:q.firm,orderable:q.orderable,geometryAudit:audit(d)});
}
function imageCase(c){const w=400,h=400,data=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){
 let v=235;const r=((x-c.cx)/c.rx)**2+((y-c.cy)/c.ry)**2;if(c.kind!=='blank'&&r<=1&&r>=.65)v=c.contrast=== 'low'?210:25;
 if(c.occlude&&x>c.cx&&y<c.cy)v=235;if(c.clutter&&x>20&&x<80&&y>30&&y<120)v=30;
 const i=(y*w+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;}
 return {width:w,height:h,data};}
const cases=[{id:'blank',kind:'blank',cx:200,cy:200,rx:100,ry:70},...['normal','low','occluded','clutter'].flatMap(kind=>[1,.7,.4].map(ratio=>({id:kind+'-'+ratio,kind,cx:200,cy:190,rx:110,ry:110*ratio,contrast:kind==='low'?'low':'high',occlude:kind==='occluded',clutter:kind==='clutter'}))),{id:'clipped',kind:'clipped',cx:30,cy:200,rx:110,ry:70}];
function iou(a,b){const intersection=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));return intersection/(a.width*a.height+b.width*b.height-intersection);}
async function main(){
 const cv=require('../mobile/vendor/opencv-4.13.0.js');if(!cv.Mat)await new Promise(resolve=>cv.onRuntimeInitialized=resolve);
 report.outlines=cases.map(c=>{const candidates=S.suggest(cv,imageCase(c)),target={x:(c.cx-c.rx)/400,y:(c.cy-c.ry)/400,width:2*c.rx/400,height:2*c.ry/400};return {case:c.id,synthetic:true,candidates:candidates.length,topIoU:candidates[0]?Number(iou(candidates[0],target).toFixed(4)):null,expectation:c.kind==='normal'?'top IoU >= 0.85':c.kind==='blank'?'no candidates':'challenge; report only',pass:c.kind==='normal'?(!!candidates[0]&&iou(candidates[0],target)>=.85):c.kind==='blank'?candidates.length===0:null};});
 report.captureChecks=[];for(const unit of ['in','mm']){const r=S.record({diameter:unit==='in'?15.5:393.7,projection:unit==='in'?9:228.6,unit,outlineReviewed:true,approximate:true});report.captureChecks.push({unit,pass:r.fixture.diameterMm===393.7&&r.fixture.projectionMm===228.6&&r.measurementSource==='user-entered-approximate'&&!r.manufacturingReady});}
 const generated=report.designs.filter(d=>d.status==='generated');report.summary={designCases:report.designs.length,generated:generated.length,rejected:report.designs.length-generated.length,invalidGenerated:generated.filter(d=>!d.pass).length,outlineCases:report.outlines.length,outlineRequiredFailures:report.outlines.filter(d=>d.pass===false).length,costComparisons:report.costs.length};
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
 const costs=report.costs.map(c=>`| ${c.projectionMm} | ${c.style} | ${c.stock} | ${c.sheets} | $${c.knownSubtotalUSD.toFixed(2)} | ${c.panelCutMeters} |`).join('\n');
 const text=`# Scan-to-kit benchmark\n\nRun with \`node simulations/benchmark.cjs\`. Results are deterministic; source hashes are in results.json.\n\n## Scope and results\n\n${JSON.stringify(report.summary,null,2)}\n\n${report.limitations.map(x=>'- '+x).join('\n')}\n\n## Measurement\n\nThe actual OpenCV outline detector runs against 14 procedurally rendered images, including normal, low-contrast, occluded, cluttered and clipped cases. Normal cases require top-candidate intersection-over-union >= 0.85; blank images require no candidates. Challenge failures are recorded, not hidden. No metric depth or diameter is inferred from these images. Approximate 15.5-inch by 9-inch inputs remain approximate. See sensitivity results for the effects of +/-20 mm input error; these are geometric spaces, not certified clearances.\n\n## Manufacturing geometry\n\n288 input combinations exercise dimensions, thickness and patterns. Rejected configurations are reported separately from generated valid designs. Checks cover orthogonal finite contours, hole placement, paper overlap, stock boundaries and separation, assembled corner and base-tab/slot alignment, and cut perimeter. These checks do not establish material strength or physical fit.\n\n## Cost comparison\n\nReference prices dated 2026-10-20, not newly verified. Whole-sheet and whole-roll purchasing, with 10% CU fee. Nine additional costs remain unknown. Cutting perimeter excludes coupons and does not predict machine time.\n\n| Projection mm | Style | Stock | Sheets | Known subtotal incl. fee | Panel cut m |\n|---|---|---|---|---|---|\n${costs}\n\nStock choices preserve each style's geometry. Different patterns have different cutting lengths even where material subtotals match. The cheapest listed subtotal is not a complete-kit quote.\n`;
 fs.writeFileSync(path.join(out,'README.md'),text);console.log(report.summary);
 // Fixed expected coverage prevents broad exception handling from hiding regressions.
 const unexpectedRejections=report.designs.filter(d=>d.status==='rejected'&&!/Enclosure is too small|Panels are too short/.test(d.reason));
 if(generated.length!==234||unexpectedRejections.length||report.summary.invalidGenerated||report.summary.outlineRequiredFailures||report.captureChecks.some(c=>!c.pass)||report.costs.some(c=>!c.geometryAudit.pass)||report.planarMeasurement.some(c=>c.pass===false))process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});


