const test=require('node:test'),assert=require('node:assert/strict'),P=require('../mobile/panels'),{audit}=require('./design-audit.cjs');
const make=()=>P.generate({diameter:393.7,projection:228.6,thickness:3});
test('independent audit accepts the nine-inch planning design',()=>assert.deepEqual(audit(make()),{pass:true,failures:[]}));
test('audit detects displaced joint, missing paper, overlapping stock and false readiness',()=>{
 for(const mutate of [d=>d.panels[4].slots[0].forEach(v=>v[0]+=2),d=>d.panels[0].slots[0].forEach(v=>v[1]+=2),d=>d.paperRolls[0].items.pop(),d=>{d.sheets[0].items.push({...d.sheets[0].items[0]});},d=>d.manufacturingReady=true,d=>d.panels[0].paper.width-=20,d=>d.cutLengthMm+=10]){const d=make();mutate(d);assert.equal(audit(d).pass,false);}
});

