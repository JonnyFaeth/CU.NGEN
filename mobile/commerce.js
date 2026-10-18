(function(root){
 'use strict';
 const cents=n=>{if(typeof n!=='number'||!Number.isFinite(n)||n<0||n>100000)throw Error('Invalid cost');return Math.round(n*100);};
 function quote(materials, costs={}){
   let base=cents(materials);const unknown=[];
   for(const k of ['fabrication','packaging','handling']){if(costs[k]==null)unknown.push(k);else base+=cents(costs[k]);}
   const fee=Math.round(base*.1);let total=base+fee;
   for(const k of ['shipping','tax']){if(costs[k]==null)unknown.push(k);else total+=cents(costs[k]);}
   return {kitCost:base/100,cuFee:fee/100,knownTotal:total/100,unknown,firm:false,feeRate:.1,orderable:false};
 }
 const styles=[{id:'quiet',name:'Quiet',style:'plain',extra:0,description:'Four uninterrupted paper faces. Our simplest frame.'},{id:'split',name:'Split',style:'split',extra:0,description:'A central upright on each face. A measured rhythm of wood and paper.'},{id:'airy',name:'Airy',style:'plain',extra:15,description:'A wider, taller surround with more space around your light.'}];
 function variants(engine,input){return styles.map(s=>{try{const design=engine.design({...input,style:s.style,clearance:input.clearance+s.extra});return {...s,design};}catch(e){return {...s,error:e.message};}});}
 const api={quote,variants,styles};if(typeof module!=='undefined')module.exports=api;else root.CUCommerce=api;
})(typeof window==='undefined'?globalThis:window);
