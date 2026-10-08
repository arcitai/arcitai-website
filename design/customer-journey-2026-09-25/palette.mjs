import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));let req=0;
async function call(name,args={}){const response=await fetch('http://127.0.0.1:60865/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++req,method:'tools/call',params:{name,arguments:args}})});assert.ok(response.ok);const r=await response.json();assert.ok(!r.error&&!r.result?.isError,JSON.stringify(r));const str=r.result?.content?.find(c=>c.type==='text')?.text;try{return JSON.parse(str);}catch{return {text:str};}}
const candidate=path.join(dir,'brand-family-canvas-v3-owner-review.op');assert.ok(!fs.existsSync(candidate),'Refusing to overwrite v3');
const live=await call('read_nodes',{depth:-1});assert.equal(live.nodes.length,7);
const family=live.nodes.find(n=>n.name==='00 — Én designfamilie · tre opgaver');
const compact=family.children.find(n=>n.name==='Arc’IT AI · same family, delivery job');assert.ok(compact);
const selected=[compact,...live.nodes.filter(n=>/^0[45] —/.test(n.name))];assert.equal(selected.length,3);
const palette={'#f8f2e8':'#f1f4ee','#fbfaf7':'#f1f4ee','#615f56':'#5b665d','#6b6258':'#5b665d','#e2d9cc':'#d6ded4','#d9dbcf':'#d6ded4','#d8d9cf':'#d6ded4','#236b59':'#235348','#26221e':'#18211d'};
const nodes=[];function walk(n){nodes.push(n);if(Array.isArray(n.children))n.children.forEach(walk);}selected.forEach(walk);
for(const n of nodes){const data={};if(n.fill){const next=n.fill.map(f=>f.type==='solid'&&palette[f.color]?{...f,color:palette[f.color]}:f);if(JSON.stringify(next)!==JSON.stringify(n.fill))data.fill=next;}if(n.type==='frame'&&n.name.startsWith('Discuss your project'))data.fill=[{type:'solid',color:'#235348'}];if(Object.keys(data).length)await call('update_node',{nodeId:n.id,data});}
const label=family.children.find(n=>n.type==='text'&&n.content?.startsWith('Geist + Pixel'));assert.ok(label);await call('update_node',{nodeId:label.id,data:{content:'Gustav: chalk / ink     ·     Online Sourdough: paper / cocoa     ·     Arc’IT: mist / pine'}});
await call('set_design_md',{markdown:fs.readFileSync(path.join(dir,'DESIGN.md'),'utf8')});await call('save_document',{filePath:candidate});
function luminance(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];}
const contrast=(a,b)=>{const l=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (l[0]+.05)/(l[1]+.05);};
const ratios={body:contrast('#18211d','#f1f4ee'),muted:contrast('#5b665d','#f1f4ee'),button:contrast('#f1f4ee','#235348')};assert.ok(Object.values(ratios).every(r=>r>=4.5));console.log(JSON.stringify({candidate,changedScope:selected.map(n=>n.name),contrast:ratios}));
