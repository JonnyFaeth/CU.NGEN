(function(root){
 'use strict';
 // Map a measured coplanar rectangle from image coordinates to millimetres.
 function solve(A,b){const n=b.length;A=A.map((r,i)=>[...r,b[i]]);for(let k=0;k<n;k++){let pivot=k;for(let j=k+1;j<n;j++)if(Math.abs(A[j][k])>Math.abs(A[pivot][k]))pivot=j;[A[k],A[pivot]]=[A[pivot],A[k]];if(Math.abs(A[k][k])<1e-10)throw Error('Reference corners are degenerate. Retake the photo straight on.');let v=A[k][k];for(let c=k;c<=n;c++)A[k][c]/=v;for(let r=0;r<n;r++)if(r!==k){v=A[r][k];for(let c=k;c<=n;c++)A[r][c]-=v*A[k][c];}}return A.map(r=>r[n]);}
 function calibrate(points,width,height){
   if(![width,height].every(n=>Number.isFinite(n)&&n>=20&&n<=1000))throw Error('Reference sides must be 20–1000 mm.');
   if(!Array.isArray(points)||points.length!==4||!points.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))throw Error('Mark four reference corners.');
   let sign=0;for(let i=0;i<4;i++){const a=points[i],b=points[(i+1)%4],c=points[(i+2)%4];const cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(Math.abs(cross)<100||sign&&Math.sign(cross)!==sign)throw Error('Mark a large rectangle clockwise: top left, top right, bottom right, bottom left.');sign=Math.sign(cross);}
   const dest=[[0,0],[width,0],[width,height],[0,height]],A=[],b=[];
   points.forEach(([x,y],i)=>{const [u,v]=dest[i];A.push([x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]);b.push(u,v);});
   const h=solve(A,b);return p=>{const [x,y]=p,d=h[6]*x+h[7]*y+1;if(!Number.isFinite(d)||Math.abs(d)<1e-6)throw Error('Object is outside a reliable calibration region.');return [(h[0]*x+h[1]*y+h[2])/d,(h[3]*x+h[4]*y+h[5])/d];};
 }
 function measure(points,w,h){if(points.length!==6)throw Error('Mark four reference corners, then two opposite light corners.');const map=calibrate(points.slice(0,4),w,h),a=map(points[4]),b=map(points[5]);const width=Math.abs(b[0]-a[0]),height=Math.abs(b[1]-a[1]);if(![width,height].every(n=>Number.isFinite(n)&&n>=10&&n<=350))throw Error('Estimate falls outside the 10–350 mm desktop family. Check reference and marks.');return {width:Math.round(width*10)/10,height:Math.round(height*10)/10};}
 const api={calibrate,measure};if(typeof module!=='undefined')module.exports=api;else root.CUMeasure=api;
})(typeof window==='undefined'?globalThis:window);
