/* Original CU adapter for Stray Scanner PNG exports; no upstream source bundled. */
(function(root,f){const api=f();if(typeof module==='object')module.exports=api;else root.CUStray=api;})(globalThis,()=>{
'use strict';
const fail=m=>{throw Error(m);};
function crc(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
async function png(buffer,bits){
 const a=new Uint8Array(buffer),v=new DataView(a.buffer,a.byteOffset,a.byteLength);
 if(a.length>2e6||a.length<33||!a.slice(0,8).every((n,i)=>n===[137,80,78,71,13,10,26,10][i]))fail('Invalid or oversized depth PNG.');
 let p=8,w,h,ended=false,parts=[];
 while(p+12<=a.length){const n=v.getUint32(p),type=String.fromCharCode(...a.slice(p+4,p+8));if(n>a.length-p-12)fail('Truncated PNG.');if(crc(a.subarray(p+4,p+8+n))!==v.getUint32(p+8+n))fail('PNG checksum failed.');
 if(type==='IHDR'){if(w||p!==8||n!==13)fail('Invalid PNG header.');w=v.getUint32(p+8);h=v.getUint32(p+12);if(w!==256||h!==192||a[p+16]!==bits||a[p+17]!==0||a[p+18]||a[p+19]||a[p+20])fail('Use original Stray 256 × 192 grayscale PNGs (16-bit depth, 8-bit confidence).');}
 else if(type==='IDAT')parts.push(a.slice(p+8,p+8+n));else if(type==='IEND'){ended=true;break;}
 else if(type[0]===type[0].toUpperCase())fail('Unsupported PNG chunk.');p+=n+12;}
 if(!ended||!w||!parts.length)fail('Incomplete PNG.');
 const reader=new Blob(parts).stream().pipeThrough(new DecompressionStream('deflate')).getReader(),chunks=[];let total=0;const bpp=bits/8,stride=w*bpp,expected=(stride+1)*h;
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>expected){await reader.cancel();fail('Unexpected PNG decoded size.');}chunks.push(value);}}finally{reader.releaseLock();}
 if(total!==expected)fail('Truncated PNG pixels.');const raw=new Uint8Array(total);let o=0;for(const c of chunks){raw.set(c,o);o+=c.length;}
 const out=new Uint8Array(stride*h);let r=0;function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
 for(let y=0;y<h;y++){const filter=raw[r++];if(filter>4)fail('Invalid PNG filter.');for(let x=0;x<stride;x++){const i=y*stride+x,left=x>=bpp?out[i-bpp]:0,up=y?out[i-stride]:0,ul=y&&x>=bpp?out[i-stride-bpp]:0;out[i]=(raw[r++]+[0,left,up,Math.floor((left+up)/2),paeth(left,up,ul)][filter])&255;}}
 const values=new Uint16Array(w*h);for(let i=0;i<values.length;i++)values[i]=bits===16?(out[i*2]<<8)|out[i*2+1]:out[i];if(bits===8&&values.some(x=>x>2))fail('Not a Stray confidence map.');return {width:w,height:h,values};
}
function intrinsics(csv,frame,videoWidth,videoHeight){
 if(typeof csv!=='string'||csv.length>10e6)fail('Odometry file too large.');
 if(!Number.isInteger(videoWidth)||!Number.isInteger(videoHeight)||videoWidth<256||videoHeight<192||videoWidth>8192||videoHeight>8192)fail('Load original rgb.mp4 to establish calibration resolution.');
 const rows=csv.trim().split(/\r?\n/),head=rows.shift().split(',').map(s=>s.trim());
 if(!['frame','fx','fy','cx','cy'].every(k=>head.includes(k)))fail('This export needs per-frame calibration (Stray 1.4 format).');
 const matches=rows.map(s=>s.split(',').map(x=>x.trim())).filter(r=>r[head.indexOf('frame')]===frame);
 if(matches.length!==1)fail('Selected depth frame has no unique calibration row.');const row=matches[0],get=k=>{const s=row[head.indexOf(k)];return s===''?NaN:Number(s);};
 const fx=get('fx')*256/videoWidth,fy=get('fy')*192/videoHeight,cx=get('cx')*256/videoWidth,cy=get('cy')*192/videoHeight;
 if(![fx,fy,cx,cy].every(Number.isFinite)||fx<=0||fy<=0||cx<0||cx>256||cy<0||cy>192)fail('Invalid camera calibration.');return {fx,fy,cx,cy};
}
const sub=(a,b)=>a.map((n,i)=>n-b[i]),dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],length=a=>Math.hypot(...a);
function measure(depth,confidence,k,marks){
 if(depth.width!==256||depth.height!==192||confidence.width!==256||confidence.height!==192||depth.values.length!==49152||confidence.values.length!==49152)fail('Depth and confidence dimensions do not match.');
 if(!k||![k.fx,k.fy,k.cx,k.cy].every(Number.isFinite)||k.fx<=0||k.fy<=0)fail('Invalid calibration.');
 if(!Array.isArray(marks)||marks.length!==7)fail('Mark four ceiling points, two opposite rim points, and the lowest visible point.');
 const pts=marks.map(p=>{if(!Array.isArray(p)||p.length!==2||!p.every(Number.isInteger)||p[0]<0||p[0]>=256||p[1]<0||p[1]>=192)fail('Point outside depth frame.');const [x,y]=p,i=y*256+x,z=depth.values[i];if(confidence.values[i]!==2||z<200||z>5000)fail('A selected point has missing or low-confidence depth. Choose another frame or point.');return [(x-k.cx)*z/k.fx,(y-k.cy)*z/k.fy,z];});
 const [a,b,c,check,left,right,tip]=pts,u=sub(b,a),v=sub(c,a);let n=cross(u,v);if(length(u)<100||length(v)<100||length(n)/(length(u)*length(v))<.15)fail('Spread ceiling points farther apart, surrounding the light.');n=n.map(x=>x/length(cross(u,v)));if(dot(n,a)>0)n=n.map(x=>-x);
 const residual=Math.abs(dot(sub(check,a),n));if(residual>10)fail('Ceiling check differs by more than 10 mm. Select a flatter patch or rescan.');
 const projection=dot(sub(tip,a),n),diameter=length(sub(left,right));if(Math.abs(dot(sub(left,right),n))>15)fail('Rim points are at different ceiling heights. Select opposite points on the same rim.');
 if(diameter<50||diameter>1200||projection<20||projection>600)fail('Estimated fixture is outside supported dimensions, or lowest point is behind the ceiling.');
 return {diameterMm:Math.round(diameter*10)/10,projectionMm:Math.round(projection*10)/10,ceilingResidualMm:Math.round(residual*10)/10,method:'stray-single-frame-seven-point-v1',accuracyValidated:false,manufacturingReady:false};
}
return {png,intrinsics,measure,crc};
});
