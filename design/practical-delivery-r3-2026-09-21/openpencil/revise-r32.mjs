// Bounded native copy/navigation revision; does not modify the published site.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const endpoint='http://127.0.0.1:59192/mcp';
let request=0;
async function call(name,args) {
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++request,method:'tools/call',params:{name,arguments:args}})});
  assert.ok(response.ok,`Native HTTP ${response.status}`);
  const result=await response.json();
  if(result.error||result.result?.isError)throw Error(JSON.stringify(result.error??result.result));
  return JSON.parse(result.result.content.find(c=>c.type==='text').text);
}
const flatten=roots=>{const all=[];const walk=n=>{all.push(n);(n.children??[]).forEach(walk);};roots.forEach(walk);return all;};
const baseline=flatten(JSON.parse(fs.readFileSync(path.join(here,'arcitai-r3.1.op'),'utf8')).children);
const {nodes}=await call('read_nodes',{depth:-1});
const live=flatten(nodes);
const oldById=new Map(baseline.map(n=>[n.id,n]));
const byId=new Map(live.map(n=>[n.id,n]));
assert.equal(live.length,379,'Unexpected live document; inspect intervening edits before proceeding.');
assert.ok(!fs.existsSync(path.join(here,'arcitai-r3.2.op')),'Candidate must be absent.');
assert.equal(byId.get('n326').content,'ARC’IT AI / DRAFT 03.1 / 21 SEPTEMBER 2026');
const replacements=new Map([
  ['You’ve got it working.\nLet’s take it further.','From prototype to\nproduction-ready software.'],
  ['You’ve got it\nworking.\nLet’s take it\nfurther.','From prototype\nto production-\nready software.'],
  ['Talk about your setup ↗','Discuss a project ↗'],
  ['Watch the walkthrough ↓','Watch the introduction ↓'],
  ['THE WALKTHROUGH','PROCESS'],
  ['A promising demo is a good start.','Development and security.'],
  ['A promising demo\nis a good start.','Development\nand security.'],
  ['Let’s look at\nwhat you’ve built.','Development, review\nand ongoing support.'],
  ['FOUNDER WALKTHROUGH','INTRODUCTION'],
  ['HOW I CAN HELP','SCOPE'],
  ['Start with what you have.','Scope of work.'],
  ['Start with\nwhat you have.','Scope of work.'],
  ['A question, a first version or a setup your team already relies on.','A focused consultation, hands-on implementation or ongoing support.'],
  ['Talk it through.','AI consultation.'],
  ['Bring a question, a half-finished build or a decision you’re stuck on. We’ll look at what you have and work out a sensible next step.','We review a specific question, an existing setup or a technical decision, and agree what to do next.'],
  ['Review and improve it.','Code and security review.'],
  ['Keep the work moving.','Agent workflow setup.'],
  ['Talk through your question ↗','Discuss a consultation ↗'],
  ['Tell me what you’ve built ↗','Discuss a review ↗'],
  ['Talk about your workflow ↗','Discuss a setup ↗'],
  ['LET’S TALK','START'],
  ['Show me what\nyou’ve got.','Project inquiry.'],
  ['Tell me what it does, who uses it and where you’re unsure. We’ll work out whether I can help and what a useful first step looks like.','Describe the software, who uses it and the work you need help with. I’ll review the context and respond with a proposed next step.']
]);
const patches=new Map();
for(const n of live)if(n.type==='text'&&replacements.has(n.content)) patches.set(n.id,{content:replacements.get(n.content),...(n.name===n.content?{name:replacements.get(n.content)}:{})});
function patch(id,data){assert.ok(byId.has(id));patches.set(id,{...patches.get(id),...data});}
patch('n6',{content:'Offers ⌄',name:'Offers · existing offer selector',x:508,width:100});
patch('n7',{content:'Process',name:'Process navigation',x:638,width:100});
patch('n8',{content:'Scope',name:'Scope navigation',x:768,width:80});
patch('n168',{content:'Start',name:'Start navigation',x:283,width:46});
patch('n326',{content:'ARC’IT AI / DRAFT 03.2 / 22 SEPTEMBER 2026',name:'ARC’IT AI / DRAFT 03.2 / 22 SEPTEMBER 2026'});
patch('n328',{content:'The existing Arc’IT layout, with descriptive copy and the original Offers / Process / Scope / Start navigation. The software and defense systems remain part of the delivery.'});
patch('n331',{content:'Descriptive headings: Project inquiry, AI consultation, Code and security review, Agent workflow setup. The hero states the work: from prototype to production-ready software. Existing layout, colors, assets and black/white logos stay unchanged.'});
patch('n339',{content:'04 / NAVIGATION & PLACEHOLDERS',name:'04 / NAVIGATION & PLACEHOLDERS'});
patch('n340',{content:'Offers keeps the Arc’IT / onlinesourdough selector. Process → founder video; Scope → services; Start → inquiry. Mobile shows Offers and Start. These are static drawings. Film unrecorded; form sends nothing. The optional example remains a sample-data concept.'});
// Fail before any mutation if a targeted field was changed outside this revision.
for(const [id] of patches)assert.equal(byId.get(id).content,oldById.get(id).content,`Intervening edit in ${id}`);
for(const [id,data] of patches)await call('update_node',{nodeId:id,data});
const nav=(id,name,content,x,y,width,size)=>({id,type:'text',name,content,x,y,width,height:24,fontFamily:'Geist Mono',fontSize:size,fontWeight:400,lineHeight:1.35,textGrowth:'fixed-width-height',fill:[{type:'solid',color:'#000000'}]});
await call('insert_node',{parent:'n1',data:nav('r32-desktop-start','Start navigation','Start',878,27,90,14),postProcess:false});
await call('insert_node',{parent:'n166',data:nav('r32-mobile-offers','Offers · existing offer selector','Offers ⌄',206,25,74,12),postProcess:false});
await call('set_design_md',{markdown:fs.readFileSync(path.join(here,'../DESIGN.md'),'utf8')});
const {nodes:after}=await call('read_nodes',{depth:-1});
assert.equal(flatten(after).length,381);
// Newly inserted children append behind the header surface; first is frontmost.
for(const [id,label] of [['n1','Start navigation'],['n166','Offers · existing offer selector']]) {
  const board=after.find(n=>n.id===id);
  const added=board.children.find(n=>n.name===label);
  assert.ok(added);
  await call('update_node',{nodeId:id,data:{children:[added,...board.children.filter(n=>n.id!==added.id)]}});
}
const candidate=path.join(here,'arcitai-r3.2.op');
await call('save_document',{filePath:candidate});
console.log(JSON.stringify({changedTextNodes:patches.size,addedNavigationNodes:2,candidate,nodes:381}));
