/* CU ceiling capture: image-space assistance, never automatic metric reconstruction. */

(function(root){

'use strict';

function suggest(cv, pixels){

 const src=cv.matFromImageData(pixels),gray=new cv.Mat(),blur=new cv.Mat(),edges=new cv.Mat(),contours=new cv.MatVector(),hierarchy=new cv.Mat();

 const candidates=[];

 try {

  cv.cvtColor(src,gray,cv.COLOR_RGBA2GRAY);cv.GaussianBlur(gray,blur,new cv.Size(5,5),0);

  for(const threshold of [48,80,112,144,176]){

  cv.threshold(blur,edges,threshold,255,cv.THRESH_BINARY_INV);cv.findContours(edges,contours,hierarchy,cv.RETR_LIST,cv.CHAIN_APPROX_SIMPLE);

  const w=pixels.width,h=pixels.height;

  for(let i=0;i<contours.size();i++){

   const c=contours.get(i);

   try {

    if(c.rows<12)continue;

    const b=cv.boundingRect(c),area=Math.abs(cv.contourArea(c)),a=b.width*b.height;

    if(b.width<35||b.height<20||a<w*h*.002||a>w*h*.85||b.x<2||b.y<2||b.x+b.width>w-2||b.y+b.height>h-2)continue;

    const fill=area/a,ratio=Math.min(b.width,b.height)/Math.max(b.width,b.height);

    if(fill<.55||fill>.9||ratio<.32)continue;

    const e=cv.fitEllipse(c),ellipseArea=Math.PI*e.size.width*e.size.height/4;

    if(!Number.isFinite(ellipseArea)||Math.abs(ellipseArea-area)/ellipseArea>.2)continue;

    const centerDistance=Math.hypot((e.center.x-w/2)/w,(e.center.y-h/2)/h);

    // Rank shapes, not calibrated probabilities; user must review the rim.

    candidates.push({x:b.x/w,y:b.y/h,width:b.width/w,height:b.height/h,score:(1-centerDistance)*Math.sqrt(a/(w*h)),source:'opencv-ellipse-candidate'});

   }finally{c.delete();}

  }

  }

 }finally{src.delete();gray.delete();blur.delete();edges.delete();contours.delete();hierarchy.delete();}

 return candidates.filter(b=>b.score>=.15).sort((a,b)=>b.score-a.score).filter((b,i,all)=>!all.slice(0,i).some(a=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.width-b.width)+Math.abs(a.height-b.height)<.08)).slice(0,5);

}

function metric(value,unit){const n=Number(value);if(value===''||!Number.isFinite(n)||n<=0)throw Error('Enter a positive measurement.');if(!['mm','in'].includes(unit))throw Error('Choose millimeters or inches.');return Math.round(n*(unit==='in'?25.4:1)*100)/100;}

function record(d){

 const diameter=metric(d.diameter,d.unit),projection=metric(d.projection,d.unit);

 if(diameter<30||diameter>1500||projection<5||projection>1500)throw Error('Check dimensions: diameter 30–1500 mm, projection 5–1500 mm.');

 if(!d.outlineReviewed)throw Error('Review the fixture outline or select manual measurement.');

 if(!d.confirmed&&!d.approximate)throw Error('Confirm both measurements with a ruler or tape.');

 return {schema:'cu-ceiling-capture',version:1,mode:'ceiling',fixture:{shape:'circular-envelope',diameterMm:diameter,projectionMm:projection},measurementSource:d.approximate?'user-entered-approximate':'user-entered-physically-confirmed',outline:d.box||null,photoIncluded:false,manufacturingReady:false,mountingStatus:'unresolved',panels:5};

}

const api={suggest,metric,record};if(typeof module==='object'&&module.exports)module.exports=api;else root.CUScan=api;

})(typeof window==='object'?window:globalThis);
