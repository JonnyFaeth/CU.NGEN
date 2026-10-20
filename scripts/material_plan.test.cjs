'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const d=require('../procurement/ceiling-sample/design.json');
const {plan,hash}=require('./material_plan.cjs');
const report=plan(d);
function check(s,gap=5,margin=8){
 for(const p of s.items){
  assert.ok(p.x>=margin && p.y>=margin);
  assert.ok(p.x+p.width<=s.width-margin+1e-8 && p.y+p.height<=s.height-margin+1e-8);
 }
 for(let i=0;i<s.items.length;i++)for(let j=i+1;j<s.items.length;j++){
  const a=s.items[i],b=s.items[j];
  assert.ok(a.x+a.width+gap<=b.x+1e-8 || b.x+b.width+gap<=a.x+1e-8 ||
   a.y+a.height+gap<=b.y+1e-8 || b.y+b.height+gap<=a.y+1e-8,'Parts must have separation');
 }
}
test('unchanged five panels fit undersized sheets without rotation or lost geometry',()=>{
 for(const l of report.layouts){
  l.sheets.forEach(s=>check(s));
  const items=l.sheets.flatMap(s=>s.items);
  assert.equal(items.length,5);
  for(const p of d.panels){
   const actual=items.find(a=>a.id===p.id);
   assert.ok(actual);
   const {x,y,...geometry}=actual;
   assert.deepEqual(geometry,p);
  }
 }
 assert.equal(report.sourcePanelSHA256,hash(d.panels));
 assert.equal(report.layouts[0].sheetCount,2);
 assert.equal(report.layouts[1].sheetCount,1);
});
test('paper yield includes every insert in eight complete sets',()=>{
 assert.equal(report.paper.rolls,1);
 const s=report.paper.sheets[0];check(s);
 assert.equal(s.items.length,40);
 for(let k=1;k<=8;k++)for(const p of d.paperCutouts){
  const found=s.items.find(x=>x.id===`kit-${k}-${p.id}`);
  assert.equal(found?.width,p.width);assert.equal(found?.height,p.height);
 }
});
test('purchase and allocation are separate; single large sheet is not assumed cheaper',()=>{
 assert.equal(report.comparison.newWoodUSD,19.98);
 assert.equal(report.comparison.woodSavingUSD,22.14);
 assert.equal(report.comparison.firstWoodAndWholePaperRollUSD,59.97);
 assert.equal(report.comparison.repeatWoodAndAllocatedPaperUSD,24.98);
 assert.ok(report.layouts[1].woodUSD>report.layouts[0].woodUSD);
});
