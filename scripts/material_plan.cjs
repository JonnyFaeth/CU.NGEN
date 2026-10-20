'use strict';
// Procurement layouts only: never modify the sample already sent for quotation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const P=require('../mobile/panels.js');
const root=path.resolve(__dirname,'..');
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const cents=x=>Math.round(x*100)/100;
function plan(d){
 const undersize=0.188*25.4; // Supplier's published negative dimensional tolerance.
 const stocks=[
  {name:'two-square-sheets',width:609.6,height:609.6,unitUSD:9.99,variant:'42110553129057'},
  {name:'long-sheet',width:609.6,height:1219.2,unitUSD:31.99,variant:'42246108545121'}
 ];
 const layouts=stocks.map(s=>{
  // Use guaranteed minimum dimensions for planning, with another 8 mm edge margin.
  const sheets=P.pack(d.panels,s.width-undersize,s.height-undersize);
  return {...s,minimumWidth:s.width-undersize,minimumHeight:s.height-undersize,sheets,
   sheetCount:sheets.length,woodUSD:cents(sheets.length*s.unitUSD),
   nominalPurchasedAreaMm2:sheets.length*s.width*s.height};
 });
 // Eight sets is a demonstrated conservative yield, not an optimum claim.
 const paperItems=Array.from({length:8},(_,kit)=>d.paperCutouts.map(p=>({...p,id:`kit-${kit+1}-${p.id}`}))).flat();
 const paperSheets=P.pack(paperItems,939.8,3581.4);
 const paper={sets:8,rolls:paperSheets.length,rollUSD:39.99,allocatedUSDPerSet:cents(paperSheets.length*39.99/8),sheets:paperSheets};
 return {status:'planning only; not a manufacturing release',date:'2026-10-20',
  sourcePanelSHA256:hash(d.panels),sourceCutLengthMm:d.cutLengthMm,
  rotationAllowed:false,edgeMarginMm:8,partGapMm:5,
  layouts,paper,
  comparison:{oldWoodReferenceUSD:42.12,newWoodUSD:layouts[0].woodUSD,
   woodSavingUSD:cents(42.12-layouts[0].woodUSD),
   woodSavingPercent:cents(100*(42.12-layouts[0].woodUSD)/42.12),
   advertisedSingleBoxWoodShippingUSD:12,
   woodWithAdvertisedShippingUSD:cents(layouts[0].woodUSD+12),
   firstWoodAndWholePaperRollUSD:cents(layouts[0].woodUSD+39.99),
   repeatWoodAndAllocatedPaperUSD:cents(layouts[0].woodUSD+paper.allocatedUSDPerSet)},
  excluded:['cutting','stock trimming','adhesives','mount','packaging','labor','rejects','tax','paper shipping','CU fee'],
  qualification:'B/BB grade sourcing candidate. Actual thickness, grain direction, flatness and cut quality must be checked before release.'};
}
function paperSvg(s){
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}mm" height="${s.height}mm" viewBox="0 0 ${s.width} ${s.height}"><title>Eight sets of five paper inserts; millimeters; planning diagram</title><rect width="${s.width}" height="${s.height}" fill="#faf4e5" stroke="#444"/>${s.items.map(p=>`<g><rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}" fill="none" stroke="#26665c"/><text x="${p.x+4}" y="${p.y+16}" font-size="12">${p.id}</text></g>`).join('')}</svg>`;
}
if(require.main===module){
 const d=JSON.parse(fs.readFileSync(path.join(root,'procurement/ceiling-sample/design.json')));
 const report=plan(d),out=path.join(root,'procurement/material-efficiency');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'plan.json'),JSON.stringify(report,null,2)+'\n');
 for(const l of report.layouts)l.sheets.forEach((s,i)=>fs.writeFileSync(path.join(out,`${l.name}-${i+1}.svg`),P.sheetSvg(s)+'\n'));
 report.paper.sheets.forEach((s,i)=>fs.writeFileSync(path.join(out,`paper-eight-sets-${i+1}.svg`),paperSvg(s)+'\n'));
 console.log(JSON.stringify({comparison:report.comparison,paperRolls:report.paper.rolls,layouts:report.layouts.map(l=>({name:l.name,sheets:l.sheetCount,woodUSD:l.woodUSD}))},null,2));
}
module.exports={plan,hash};
