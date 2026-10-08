import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const output = fileURLToPath(new URL('./arcitai-open-landscape-r4-final.op', import.meta.url));
assert.ok(!fs.existsSync(output));
let id = 0;
async function call(name, args = {}) {
  const r = await fetch('http://127.0.0.1:60865/mcp', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({jsonrpc:'2.0',id:++id,method:'tools/call',params:{name,arguments:args}})});
  assert.ok(r.ok);
  const j = await r.json();
  assert.ok(!j.error && !j.result?.isError, JSON.stringify(j));
  const value = j.result.content.find(c => c.type === 'text')?.text;
  try {return JSON.parse(value);} catch {return {text:value};}
}
const {nodes} = await call('read_nodes', {depth:-1});
assert.equal(nodes.length, 4);
const normalise = text => text.replace(/\s+/g, ' ').trim();
for (const board of nodes.filter(n => !n.name.startsWith('04'))) {
  const intro = board.children.find(n => n.content?.startsWith('You’ve built something'));
  assert.ok(intro);
  const isMobile = board.name.startsWith('03');
  const content = isMobile
    ? 'You’ve built something that works.\nI help get it ready for real use — and\nset up AI agents to keep development\nand security work moving, with the\nright checks in place.'
    : 'You’ve built something that works. I help get it\nready for real use — and set up AI agents to keep\ndevelopment and security work moving, with the\nright checks in place.';
  assert.equal(normalise(content), normalise(intro.content));
  await call('update_node', {nodeId:intro.id, data:{content}});
}
const mobile = nodes.find(n => n.name.startsWith('03'));
const nav = mobile.children.find(n => n.name === 'Opaque mobile navigation');
const wordmark = mobile.children.find(n => n.content === 'Arc’IT AI');
assert.ok(nav && wordmark);
await call('update_node', {nodeId:nav.id, data:{x:168,width:148}});
await call('update_node', {nodeId:wordmark.id, data:{width:132,fontSize:24}});
const start = nav.children.find(n => n.content === 'Start ↗');
await call('update_node', {nodeId:start.id,data:{x:87,width:55}});
await call('insert_node', {parent:mobile.id,postProcess:false,data:{
  type:'frame',name:'Mobile theme control',x:322,y:20,width:44,height:44,layout:'none',clipContent:true,cornerRadius:22,fill:[{type:'solid',color:'#eee8dc'}],
  children:[{type:'text',name:'Theme moon',x:12,y:5,width:26,height:34,content:'☾',fontFamily:'Geist',fontSize:23,fontWeight:400,lineHeight:1.45,textGrowth:'fixed-width-height',fill:[{type:'solid',color:'#18211d'}]}],
}});
await call('save_document', {filePath:output});
console.log(JSON.stringify({output,changes:['Explicit hero line breaks for matching imported-font and native composition', 'Restore mobile theme control']}));
