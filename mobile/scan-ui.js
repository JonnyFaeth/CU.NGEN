/* Browser-only capture UI. Photos are never sent or persisted. */

(function(){

'use strict';

const el=id=>document.getElementById(id),canvas=el('scanCanvas'),ctx=canvas.getContext('2d');

for(const mode of ['Ceiling','Tabletop'])el('mode'+mode).onclick=()=>{const ceiling=mode==='Ceiling';el('ceilingCapture').hidden=!ceiling;for(const id of ['capture','collection','kit','tabletopChoose','tabletopKit'])el(id).hidden=ceiling;el('modeCeiling').setAttribute('aria-pressed',ceiling);el('modeTabletop').setAttribute('aria-pressed',!ceiling);document.querySelector('nav a').href=ceiling?'#ceilingCapture':'#capture';document.querySelector('.hero .button').href=ceiling?'#ceilingCapture':'#capture';};

let scanEvidence=null;
let picture=null,box=null,candidates=[],candidateIndex=0,marking=false,marks=[],generation=0,cvReady=null;

function library(){

 if(cvReady)return cvReady;

 cvReady=new Promise((resolve,reject)=>{

  const script=document.createElement('script');script.src='vendor/opencv-4.13.0.js';let timer;

  const timeout=setTimeout(()=>{clearInterval(timer);reject(Error('Outline helper took too long. Adjust the outline manually.'));},25000);

  script.onerror=()=>{clearTimeout(timeout);reject(Error('Outline helper unavailable. Adjust the outline manually.'));};

  script.onload=()=>{timer=setInterval(()=>{if(window.cv&&window.cv.Mat){clearInterval(timer);clearTimeout(timeout);resolve(true);}},50);};document.head.append(script);

 });return cvReady;

}

function validate(){

 let result;try{result=CUScan.record({diameter:el('scanDiameter').value,projection:el('scanProjection').value,unit:el('scanUnit').value,outlineReviewed:el('scanManual').checked||(!!box&&el('scanOutlineOK').checked),approximate:el('scanPlanning').checked,confirmed:el('scanConfirmed').checked,box:el('scanManual').checked?null:box});}catch(e){el('scanValidation').textContent=e.message;el('scanSave').disabled=true;el('scanSummary').textContent='';window.dispatchEvent(new CustomEvent('cu-ceiling-capture',{detail:null}));return null;}

 if(scanEvidence)result.scanEvidence={...scanEvidence};
 el('scanSave').disabled=false;el('scanValidation').textContent='Measurements ready to save. Ceiling fabrication remains unvalidated.';

 el('scanSummary').textContent=`${result.measurementSource==='user-entered-approximate'?'APPROXIMATE PLANNING ONLY. ':''}Fixture envelope: Ø ${result.fixture.diameterMm} mm × ${result.fixture.projectionMm} mm below ceiling. Four walls + one bottom panel; open top.`;window.dispatchEvent(new CustomEvent('cu-ceiling-capture',{detail:result}));return result;

}

function invalidate(){el('scanOutlineOK').checked=false;validate();}

function paint(){

 ctx.clearRect(0,0,canvas.width,canvas.height);if(picture)ctx.drawImage(picture,0,0,canvas.width,canvas.height);

 if(box){const x=box.x*canvas.width,y=box.y*canvas.height,w=box.width*canvas.width,h=box.height*canvas.height;ctx.strokeStyle='#80ffbf';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);ctx.stroke();}

 for(const p of marks){ctx.fillStyle='#ffe275';ctx.beginPath();ctx.arc(p[0]*canvas.width,p[1]*canvas.height,6,0,Math.PI*2);ctx.fill();}

}

function setBox(b){box=b;for(const [id,key] of [['scanX','x'],['scanY','y'],['scanW','width'],['scanH','height']])el(id).value=b[key]*100;el('scanAdjust').hidden=false;el('scanOutlineOK').disabled=false;invalidate();paint();}

async function suggest(){

 if(!picture)return;const ticket=generation;el('scanSuggest').disabled=true;el('scanStatus').textContent='Looking for a circular rim…';

 try{await library();if(ticket!==generation)return;

  // Offscreen pixels exclude our own overlays.

  const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;c.getContext('2d').drawImage(picture,0,0,c.width,c.height);

  candidates=CUScan.suggest(window.cv,c.getContext('2d').getImageData(0,0,c.width,c.height));candidateIndex=0;

  if(candidates.length){setBox(candidates[0]);el('scanStatus').textContent=`Suggested outline 1 of ${candidates.length}. Check the outer rim; it may have selected another object.`;}else{el('scanStatus').textContent='No reliable rim candidate. Mark two opposite corners or adjust the box.';}

 }catch(e){if(ticket===generation)el('scanStatus').textContent=e.message;}

 finally{if(ticket===generation){el('scanSuggest').disabled=!picture;el('scanNext').disabled=candidates.length<2;}}

}

function resetPhoto(){scanEvidence=null;generation++;picture=null;box=null;candidates=[];marks=[];marking=false;el('scanAdjust').hidden=true;canvas.classList.remove('loaded');el('scanOutlineOK').checked=false;el('scanOutlineOK').disabled=true;for(const id of ['scanSuggest','scanNext','scanMark'])el(id).disabled=true;el('scanConfirmed').checked=false;paint();validate();}

for(const id of ['scanCamera','scanPhoto'])el(id).onchange=e=>{

 const file=e.target.files[0];e.target.value='';if(!file)return;resetPhoto();el('scanManual').checked=false;validate();

 if(file.size>20*1024*1024){el('scanStatus').textContent='Choose an image smaller than 20 MB.';return;}

 const ticket=generation,url=URL.createObjectURL(file),img=new Image();el('scanStatus').textContent='Opening photo…';

 img.onload=()=>{URL.revokeObjectURL(url);if(ticket!==generation)return;picture=img;const scale=Math.min(1,1000/img.width,1000/img.height);canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.classList.add('loaded');el('scanMark').disabled=false;setBox({x:.2,y:.2,width:.6,height:.6,source:'manual'});suggest();};

 img.onerror=()=>{URL.revokeObjectURL(url);if(ticket===generation)el('scanStatus').textContent='This browser could not decode the photo. Export HEIC as JPEG, or choose a JPEG/PNG. You can still enter manual measurements.';};img.src=url;

};

el('scanSuggest').onclick=suggest;el('scanNext').onclick=()=>{candidateIndex=(candidateIndex+1)%candidates.length;setBox(candidates[candidateIndex]);el('scanStatus').textContent=`Suggested outline ${candidateIndex+1} of ${candidates.length}. Review before accepting.`;};

for(const id of ['scanX','scanY','scanW','scanH'])el(id).oninput=()=>{if(!box)return;const x=Math.min(.99,Number(el('scanX').value)/100),y=Math.min(.99,Number(el('scanY').value)/100);setBox({x,y,width:Math.min(1-x,Number(el('scanW').value)/100),height:Math.min(1-y,Number(el('scanH').value)/100),source:'user-adjusted'});};

el('scanMark').onclick=()=>{marking=true;marks=[];invalidate();el('scanStatus').textContent='Tap one corner of a box around the full rim, then the opposite corner.';paint();};

canvas.onclick=e=>{if(!marking||!picture)return;const r=canvas.getBoundingClientRect();marks.push([Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))]);paint();if(marks.length===2){const [a,b]=marks;marks=[];marking=false;if(Math.abs(a[0]-b[0])<.02||Math.abs(a[1]-b[1])<.02){el('scanStatus').textContent='Corners too close. Try marking again.';return;}setBox({x:Math.min(a[0],b[0]),y:Math.min(a[1],b[1]),width:Math.abs(a[0]-b[0]),height:Math.abs(a[1]-b[1]),source:'user-marked'});el('scanStatus').textContent='Manual outline set. Review it and enter your measurements.';}};

for(const id of ['scanDiameter','scanProjection','scanUnit'])el(id).oninput=()=>{scanEvidence=null;el('scanConfirmed').checked=false;validate();};

for(const id of ['scanOutlineOK','scanManual','scanConfirmed','scanPlanning'])el(id).onchange=validate;

el('scanSave').onclick=()=>{const data=validate();if(!data)return;const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='cu-ceiling-measurements.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);};

el('scanReset').onclick=()=>{resetPhoto();for(const id of ['scanDiameter','scanProjection'])el(id).value='';el('scanManual').checked=false;el('scanStatus').textContent='Capture cleared. Choose a photo or use manual measurements.';validate();};

window.addEventListener('cu-stray-estimate',e=>{
 const r=e.detail;if(!r||r.method!=='stray-single-frame-seven-point-v1'||!Number.isFinite(r.diameterMm)||!Number.isFinite(r.projectionMm))return;
 resetPhoto();scanEvidence={method:r.method,frame:r.frame,ceilingResidualMm:r.ceilingResidualMm,accuracyValidated:false};
 el('scanUnit').value='mm';el('scanDiameter').value=r.diameterMm;el('scanProjection').value=r.projectionMm;
 el('scanManual').checked=true;el('scanPlanning').checked=true;el('scanConfirmed').checked=false;
 el('scanStatus').textContent='Dimensions supplied by Stray depth scan; no photo outline is used.';validate();
});
validate();

})();
