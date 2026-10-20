const test=require('node:test'),assert=require('node:assert/strict');const S=require('./scan.js');
const base={diameter:'15.5',projection:'4',unit:'in',outlineReviewed:true,confirmed:true};
test('ceiling capture accepts real-size diameter beyond tabletop bounds',()=>{const r=S.record(base);assert.equal(r.fixture.diameterMm,393.7);assert.equal(r.fixture.projectionMm,101.6);assert.equal(r.manufacturingReady,false);assert.equal(r.photoIncluded,false);});
test('missing projection, invalid units and out-of-range measurements are rejected',()=>{for(const change of [{projection:''},{projection:-1},{diameter:0},{diameter:'abc'},{unit:'cm'},{diameter:2000}])assert.throws(()=>S.record({...base,...change}));});
test('confirmation and outline review are separate requirements',()=>{assert.throws(()=>S.record({...base,confirmed:false}));assert.throws(()=>S.record({...base,outlineReviewed:false}));});
test('manual measurements save no image or outline',()=>{const r=S.record({...base,box:null});assert.equal(r.outline,null);assert.equal(r.measurementSource,'user-entered-physically-confirmed');});
test('OpenCV detects a synthetic elliptical rim and rejects a blank frame',async()=>{
 const cv=require('./vendor/opencv-4.13.0.js');await new Promise(resolve=>{if(cv.Mat)resolve();else cv.onRuntimeInitialized=()=>resolve();});
 const w=400,h=400,data=new Uint8ClampedArray(w*h*4).fill(255);
 assert.equal(S.suggest(cv,{width:w,height:h,data}).length,0);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const r=((x-200)/110)**2+((y-180)/75)**2;if(r<=1&&r>=.65){const i=(y*w+x)*4;data[i]=data[i+1]=data[i+2]=25;}}
 const b=S.suggest(cv,{width:w,height:h,data})[0];assert.ok(b);assert.ok(Math.abs(b.width*w-220)<10);assert.ok(Math.abs(b.height*h-150)<10);
});
