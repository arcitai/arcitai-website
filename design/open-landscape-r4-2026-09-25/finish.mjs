import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const output = fileURLToPath(new URL('./arcitai-open-landscape-r4-ready.op', import.meta.url));
assert.ok(!fs.existsSync(output));
let id = 0;
async function call(name,args={}) {
  const r=await fetch('http://127.0.0.1:60865/mcp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++id,method:'tools/call',params:{name,arguments:args}})});
  assert.ok(r.ok);
  const j=await r.json(); assert.ok(!j.error&&!j.result?.isError,JSON.stringify(j));
  const value=j.result.content.find(c=>c.type==='text')?.text;
  try{return JSON.parse(value);}catch{return {text:value};}
}
const {nodes}=await call('read_nodes',{depth:-1});
const mobile=nodes.find(n=>n.name.startsWith('03'));
const normalise=s=>s.replace(/\s+/g,' ').trim();
const breaks=[
  'Maybe you’ve vibe-coded a promising\ndemo. Maybe a developer built your MVP.\nI’m Gustav. I look at what it needs to do\nfor your business, work through the gaps,\nand take care of the implementation —\nfrom the first review to the way it’s\nmaintained.',
  'Solve a specific problem, get ready for\nproduction, or put a repeatable setup\nin place.',
  'Bring a question, a blocker or a setup\nyou’re unsure about. We work through\nit together and decide what’s worth\ndoing next.',
  'I review the code, permissions and\nintegrations in what you’ve built.\nThen I fix the agreed issues, test the\nchanges and help get it released.',
];
for(const content of breaks){
  const node=mobile.children.find(n=>n.content&&normalise(n.content)===normalise(content));
  assert.ok(node,content);
  await call('update_node',{nodeId:node.id,data:{content}});
}
// Web renderer drops this nested text at the deep canvas position. Keep the
// label editable on the same visual plane, outside the clipped button frame.
const desktop=nodes.find(n=>n.name.startsWith('01'));
const factory=desktop.children.find(n=>n.name.startsWith('Full-width factory offer'));
const button=factory.children.find(n=>n.name==='Discuss a setup');
const label=button.children.find(n=>n.content==='Discuss a setup');
assert.ok(label);
await call('delete_node',{nodeId:label.id});
const {id:oldId,...data}=label;
await call('insert_node',{parent:factory.id,postProcess:false,data:{...data,x:button.x+label.x,y:button.y+label.y}});
await call('save_document',{filePath:output});
console.log(JSON.stringify({output,changes:['Mobile paragraph wrapping', 'Editable factory action label outside nested clip']}));
