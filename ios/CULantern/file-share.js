/* Injected only into CU's bundled WKWebView, before the design engine loads. */
(function(){
'use strict';
const bridge=window.webkit?.messageHandlers?.cuFiles;if(!bridge)return;
let pending=false;
function report(message){let node=document.getElementById('cuFileStatus');if(!node){node=document.createElement('p');node.id='cuFileStatus';node.setAttribute('role','status');node.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;z-index:9999;background:#243e30;color:white;padding:16px;border-radius:12px';document.body.append(node);}node.textContent=message;}
window.addEventListener('cu-file-status',event=>{pending=false;report(event.detail?.message||'Export closed.');});
function validName(name){return typeof name==='string'&&/^[A-Za-z0-9][A-Za-z0-9._ -]{0,119}$/.test(name)&&/\.(zip|json|svg|dxf|html|txt|csv|pdf)$/i.test(name);}
async function share(anchor){if(pending){report('Finish the current export before starting another.');return;}pending=true;report('Preparing file. Choose Save to Files or a sharing destination.');try{if(!validName(anchor.download))throw Error('Unsupported export filename.');const response=await fetch(anchor.href);if(!response.ok)throw Error('Unable to read this export.');const blob=await response.blob();if(blob.size>20*1024*1024)throw Error('Export exceeds the 20 MB limit.');const bytes=new Uint8Array(await blob.arrayBuffer());let text='';for(let i=0;i<bytes.length;i+=16384)text+=String.fromCharCode(...bytes.subarray(i,i+16384));bridge.postMessage({name:anchor.download,base64:btoa(text)});}catch(error){pending=false;report('Export failed: '+error.message);}}
const original=HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click=function(){if(this.download&&this.href.startsWith('blob:')){void share(this);return;}return original.apply(this,arguments);};
document.addEventListener('click',event=>{const a=event.target.closest?.('a[download]');if(a&&a.href.startsWith('blob:')){event.preventDefault();void share(a);}},true);
window.addEventListener('DOMContentLoaded',()=>{const install=document.getElementById('installHelp');if(install)install.hidden=true;const status=document.getElementById('nativeStatus');if(status)status.textContent='Capture the whole rim, surrounding ceiling and lowest stem in at least two views. Keep your feet on the floor; no ladder is needed.';});
})();
