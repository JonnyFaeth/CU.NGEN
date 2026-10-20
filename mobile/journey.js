/* Customer planning workflow. No checkout or physical certification. */
(function(root){'use strict';
const styles=[{id:'plain',name:'Quiet',description:'Open paper windows and a simple wooden outline.'},{id:'horizontal',name:'Horizon',description:'Even horizontal ribs with a calm, linear rhythm.'},{id:'stepped',name:'Terrace',description:'Stepped openings for a more sculptural pattern.'}];
function variants(P,input,costs){return styles.map(style=>{try{const design=P.generate({...input,style:style.id});return {...style,design,quote:P.quote(design,costs)};}catch(e){return {...style,error:e.message};}});}
function review(capture,design,quote,fixture={},exampleOnly=false){
 const reasons=[];
 if(exampleOnly)reasons.push('Replace the demonstration with your own fixture measurements.');
 if(capture?.measurementSource!=='user-entered-physically-confirmed')reasons.push('Verify the diameter and full ceiling projection with a ruler or tape.');
 if(fixture.shape!=='round-flush')reasons.push('CU review: confirm the fixture geometry and installation type from available evidence.');
 if(fixture.bulb!=='led')reasons.push('CU review: establish light-source suitability; hot bulbs and flames are outside this prototype scope.');
 if(!fixture.model?.trim())reasons.push('CU review: identify relevant fixture specifications and instructions.');
 if(!fixture.wattage?.trim())reasons.push('CU review: confirm heat, clearances and enclosure suitability.');
 reasons.push('CU must verify the attachment, access for service and enclosure suitability.','Cut a fit coupon and physically validate the prototype.','Confirm fabrication, packing, delivery and lead time before accepting payment.');
 for(const item of quote.unknown)reasons.push('Obtain a price for '+item+'.');
 return {schema:'cu-kit-review',version:1,status:'draft-review-request',orderPlaced:false,paymentEnabled:false,manufacturingReady:false,exampleOnly,measurementSource:capture?.measurementSource||'synthetic-example',fixture:{shape:fixture.shape||'unknown',bulb:fixture.bulb||'unknown',model:String(fixture.model||'').slice(0,200),wattage:String(fixture.wattage||'').slice(0,80)},design,quote,openItems:reasons};
}
function project(capture,design,costs,fixture,exampleOnly){return {schema:'cu-saved-project',version:1,capture:JSON.parse(JSON.stringify(capture)),input:design.input,costs:{...costs},fixture:{...fixture},exampleOnly:!!exampleOnly};}
function restore(P,raw){
 const p=typeof raw==='string'?JSON.parse(raw):raw;
 if(!p||p.schema!=='cu-saved-project'||p.version!==1||!p.capture?.fixture||!p.input||!p.costs)throw Error('This is not a supported CU project.');
 if(!p.exampleOnly&&!['user-entered-approximate','user-entered-physically-confirmed'].includes(p.capture.measurementSource))throw Error('Unknown measurement provenance.');
 const design=P.generate(p.input);P.quote(design,p.costs);
 if(design.input.diameter!==Number(p.capture.fixture.diameterMm)||design.input.projection!==Number(p.capture.fixture.projectionMm))throw Error('Saved dimensions disagree. Start a fresh capture.');
 if(!['square','long','custom'].includes(p.costs.stockOption))throw Error('Unknown stock option.');
 if(!['round-flush','other','unknown'].includes(p.fixture?.shape)||!['led','hot','unknown'].includes(p.fixture?.bulb))throw Error('Unsupported fixture details.');
 return p;
}
const api={styles,variants,review,project,restore};if(typeof module==='object'&&module.exports)module.exports=api;else root.CUJourney=api;
})(typeof window==='object'?window:globalThis);
