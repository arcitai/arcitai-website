import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('./arcitai-open-landscape-r4-owner-review.op',import.meta.url));
assert.ok(!fs.existsSync(output));
let id=0;
async function call(name,args={}){
 const r=await fetch('http://127.0.0.1:60865/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++id,method:'tools/call',params:{name,arguments:args}})});
 assert.ok(r.ok);const j=await r.json();assert.ok(!j.error&&!j.result?.isError,JSON.stringify(j));const value=j.result.content.find(c=>c.type==='text')?.text;try{return JSON.parse(value);}catch{return {text:value};}
}
const {nodes}=await call('read_nodes',{depth:-1});
const factory=nodes.find(n=>n.name.startsWith('01')).children.find(n=>n.name.startsWith('Full-width factory offer'));
const label=factory.children.find(n=>n.type==='text'&&n.content==='Discuss a setup');
assert.ok(label);
await call('move_node',{nodeId:label.id,parent:factory.id,index:'0'});
const {nodes:after}=await call('read_nodes',{nodeIds:[factory.id],depth:1});
assert.equal(after[0].children[0].id,label.id);
await call('save_document',{filePath:output});
console.log(JSON.stringify({output,change:'Place factory action label in front of its control'}));
