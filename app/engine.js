/* CU.NGEN Lantern Studio — deterministic millimetre geometry. No dependencies. */
(function (root) {
  'use strict';
  const VERSION = '0.2.0';
  const S = 12.7, OVERLAP = 6, STOCK = 914.4, TRIM = 10, KERF = 3;
  const catalog = {
    wood: {name:'½ × ½ × 36 in square birch/poplar dowel', sku:'DRSQ-12-36', price:2.13, date:'2026-10-17', status:'Listing says unavailable; confirm or source equivalent locally', url:'https://woodpeckerscrafts.com/products/1-2-x-36-square-dowel'},
    paperLetter: {name:'Off-white kozo paper, 45 gsm, 8½ × 11 in',sku:'GPC-TN-2751-8',price:1.85,date:'2026-10-17',status:'Verify stock at checkout',url:'https://mulberrypaperandmore.com/p-1029-mulberry-paper-unbleached-off-white.aspx'},
    paperLarge: {name:'Off-white kozo paper, 45 gsm, 25 × 37 in',sku:'GPC-TN-2751-25',price:9.45,date:'2026-10-17',status:'Verify stock at checkout',url:'https://mulberrypaperandmore.com/p-1029-mulberry-paper-unbleached-off-white.aspx'},
    glue: {name:'Titebond Original wood glue, 4 oz',sku:'Rockler 80862',price:2.99,date:'2026-10-17',status:'Verify variant and stock at checkout',url:'https://www.rockler.com/titebondreg-original-glue-optional-sizes'},
    paste: {name:'Shoji Nori Glue, 150 g',sku:'Y7',price:5.99,date:'2026-10-17',status:'Verify stock at checkout',url:'https://www.eshoji.com/shoji-nori-glue/'}
  };
  function number(v, name, min, max) {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) throw new Error(`${name} must be ${min}–${max}.`);
    return v;
  }
  const round = n => Math.round(n*100)/100;
  const ceil = n => Math.ceil(n*2)/2;
  function photoMeasure(points, referenceMm) {
    number(referenceMm,'Reference length (mm)',10,1000);
    if (!Array.isArray(points) || points.length!==4) throw new Error('Mark two reference endpoints, then two opposite corners of the light.');
    for (const p of points) if (!Array.isArray(p) || p.length!==2 || !p.every(Number.isFinite)) throw new Error('Invalid photo points.');
    const scalePixels = Math.hypot(points[0][0]-points[1][0],points[0][1]-points[1][1]);
    if (scalePixels < 20) throw new Error('Reference is too small. Use endpoints at least 20 displayed pixels apart.');
    const width = Math.abs(points[2][0]-points[3][0])*referenceMm/scalePixels;
    const height = Math.abs(points[2][1]-points[3][1])*referenceMm/scalePixels;
    if (Math.min(width,height)<5) throw new Error('Mark opposite corners enclosing the entire light.');
    return {width:round(width),height:round(height),status:'Photo estimate only; ruler confirmation required'};
  }
  function packCuts(cuts) {
    const bars=[];
    for (const piece of [...cuts].sort((a,b)=>b.length-a.length)) {
      const used=piece.length+KERF;
      if (used>STOCK-TRIM) throw new Error('A part exceeds usable stock length.');
      let bar=bars.find(b=>b.remaining+1e-8>=used);
      if (!bar) { bar={pieces:[],remaining:STOCK-TRIM};bars.push(bar); }
      bar.pieces.push(piece);bar.remaining=round(bar.remaining-used);
    }
    return bars;
  }
  function design(input) {
    if (!input || typeof input!=='object') throw new Error('Project data is missing.');
    const i={...input};
    for (const k of ['width','depth','height']) number(i[k],`Light ${k} (mm)`,10,350);
    number(i.clearance,'Design clearance (mm)',10,100);
    number(i.tolerance,'Measurement allowance (mm)',1,10);
    number(i.gap,'Bottom opening (mm)',15,40);
    if (!['battery-led','corded-led','unknown','hot'].includes(i.lightType)) throw new Error('Choose a supported light type.');
    if (!['plain','split'].includes(i.style)) throw new Error('Choose a supported frame style.');
    // Include the whole base, switches, plug exits and swept adjustment envelope in measured light size.
    const innerW=ceil(i.width+2*(i.clearance+i.tolerance));
    const innerD=ceil(i.depth+2*(i.clearance+i.tolerance));
    const W=round(innerW+2*S), D=round(innerD+2*S);
    const H=ceil(Math.max(i.height+i.clearance+i.tolerance+S,i.gap+2*S+60));
    if (Math.max(W,D)>400 || H>450) throw new Error('This light needs a larger frame than this desktop prototype supports (400 mm wide/deep, 450 mm tall).');
    if (H/Math.min(W,D)>2.5) throw new Error('Frame is too slender for this prototype family. Increase side clearance or use a shorter light.');
    const cuts=[];
    for(let n=1;n<=4;n++) cuts.push({id:`A${n}`,part:'Upright',length:H});
    for(let n=1;n<=4;n++) cuts.push({id:`B${n}`,part:'Front/back rail',length:innerW});
    for(let n=1;n<=4;n++) cuts.push({id:`C${n}`,part:'Side rail',length:innerD});
    const openingH=round(H-i.gap-2*S);
    if(i.style==='split') for(let n=1;n<=4;n++) cuts.push({id:`D${n}`,part:'Center mullion',length:openingH});
    const panels=[{face:'Front / back',qty:2,width:round(innerW+2*OVERLAP),height:round(openingH+2*OVERLAP)},
      {face:'Left / right',qty:2,width:round(innerD+2*OVERLAP),height:round(openingH+2*OVERLAP)}];
    const fits=(p,w,h)=>p.width+4<=w&&p.height+4<=h||p.height+4<=w&&p.width+4<=h;
    const paperKey=panels.every(p=>fits(p,215.9,279.4))?'paperLetter':'paperLarge';
    // One purchased sheet per panel, intentionally conservative, no fictitious nesting yield.
    if(!panels.every(p=>fits(p,paperKey==='paperLetter'?215.9:635,paperKey==='paperLetter'?279.4:939.8))) throw new Error('Paper panels exceed catalog sheets.');
    const bars=packCuts(cuts);
    const bom=[['wood',bars.length], [paperKey,4], ['glue',1],['paste',1]].map(([key,qty])=>({key,qty,...catalog[key],line:round(qty*catalog[key].price)}));
    const holds=[];
    if(i.confirmed!==true) holds.push('Verify width, depth and height with a ruler. Photos alone are not fabrication measurements.');
    if(i.lightType==='hot') holds.push('Flame, incandescent and halogen sources are outside this paper-surround prototype. Do not place this shade around them.');
    if(i.lightType==='unknown') holds.push('Identify the complete light and its source type.');
    if(i.clearanceVerified!==true || typeof i.evidence!=='string' || i.evidence.trim().length<8) holds.push('Record manufacturer installation guidance that permits a surround and its required clearances.');
    if(i.lightType==='corded-led') holds.push('Corded-light routing, plug clearance and ventilation require a separate physical assessment; v0.2 supports unlit mockups only.');
    const cost=round(bom.reduce((s,b)=>s+b.line,0));
    return {version:VERSION,input:i,frame:{width:W,depth:D,height:H,section:S,gap:i.gap,openingH},
      clearance:{sides:round((innerW-i.width)/2),frontBack:round((innerD-i.depth)/2),top:round(H-S-i.height)},
      cuts,bars,panels,bom,listedSubtotal:cost,holds,
      status:holds.length?'Measurement / integration review needed':'Measured geometry — prototype testing still required',
      physicalApproval:false,priceDate:'2026-10-17',
      assumptions:['Independent open-top/open-bottom surround. Original light stays on its own base on a flat table.',
        '12.7 mm square stock; nominal cut lengths. Actual stock variation must be checked.',
        '3 mm kerf per cut, 10 mm end trim per 914.4 mm bar. First-fit packing, not proven optimal.',
        'No joint strength, thermal suitability, tipping resistance, optical output or runtime is certified.',
        'Catalog prices are dated listings, not live quotes. Tools, shipping, tax and testing excluded.'],
      material:{woodVolumeMm3:round(cuts.reduce((v,p)=>v+p.length*S*S,0)),paperAreaM2:round(panels.reduce((v,p)=>v+p.qty*p.width*p.height,0)/1e6)}};
  }
  function quote(result, prices={}, extras={}) {
    let cents=0;
    const lines=result.bom.map(row=>{
      const p=prices[row.key]===undefined?row.price:prices[row.key];
      number(p,`${row.name} unit price`,0,10000);
      const lineCents=Math.round(p*100)*row.qty;cents+=lineCents;
      return {...row,price:p,line:lineCents/100,source:prices[row.key]===undefined?'Catalog listing':'User-entered quote'};
    });
    const unknown=[];
    for(const k of ['tools','shipping','tax','cutting','testing']) {
      if(extras[k]===null||extras[k]===undefined||extras[k]==='') unknown.push(k);
      else {number(extras[k],k,0,10000);cents+=Math.round(extras[k]*100);}
    }
    return {lines,knownTotal:cents/100,unknown,complete:unknown.length===0};
  }
  const api={VERSION,catalog,design,quote,photoMeasure,packCuts};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.LanternEngine=api;
})(typeof window!=='undefined'?window:globalThis);
