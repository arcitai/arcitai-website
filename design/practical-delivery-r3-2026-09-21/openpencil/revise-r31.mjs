// One-time native revision of the inspected R3 board. Never rerun on user edits.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const endpoint = 'http://127.0.0.1:59404/mcp';
let request = 0;
async function call(name, args) {
  const response = await fetch(endpoint, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({jsonrpc:'2.0',id:++request,method:'tools/call',params:{name,arguments:args}})
  });
  if (!response.ok) throw new Error(`Native HTTP ${response.status}`);
  const result = await response.json();
  if (result.error || result.result?.isError) throw new Error(JSON.stringify(result.error ?? result.result));
  const value = result.result.content.find(c => c.type === 'text').text;
  try { return JSON.parse(value); } catch { return value; }
}
assert.ok(!fs.existsSync(path.join(here,'arcitai-r3.1.op')), 'Candidate must be absent.');
const {nodes} = await call('read_nodes',{depth:-1});
const flat = [];
const walk = n => { flat.push(n); (n.children ?? []).forEach(walk); };
nodes.forEach(walk);
const byId = new Map(flat.map(n=>[n.id,n]));
const get = id => { assert.ok(byId.has(id),`Missing ${id}`); return byId.get(id); };
assert.equal(flat.length,350);
assert.equal(get('n4').name,'Restrained glass navigation');
assert.equal(get('n326').content,'ARC’IT AI / DRAFT 03 / 21 SEPTEMBER 2026');
const [desktop,mobile,notes] = nodes;
assert.deepEqual(nodes.map(n=>n.id),['n1','n166','n325']);
const solid = color => [{type:'solid',color}];
let seq = 0;
const node = (type,name,x,y,width,height,extra={}) => ({id:`r31-${++seq}`,type,name,x,y,width,height,...extra});
const box = (name,x,y,w,h,color) => node('rectangle',name,x,y,w,h,{fill:solid(color),cornerRadius:0});
const label = (name,content,x,y,w,h,size=14,color='#000000',font='Geist Mono') => node('text',name,x,y,w,h,{content,fontFamily:font,fontSize:size,fontWeight:400,lineHeight:1.35,textGrowth:'fixed-width-height',fill:solid(color)});
function theme(x,y) {
  return node('frame','Theme control · static specimen',x,y,24,24,{layout:'none',fill:[],children:[
    node('path','Half-disc',3,3,9,18,{d:'M9 0 A9 9 0 0 0 9 18 Z',fill:solid('#000000')}),
    node('ellipse','Paper centre',4,4,16,16,{fill:solid('#f8f2e8')}),
    node('ellipse','Disc outline',2,2,20,20,{fill:solid('#000000')})
  ]});
}

// The native editor paints first children on top. Keep existing sibling order.
Object.assign(get('n4'),{name:'Opaque full-width navigation',x:0,y:0,width:1440,height:72,cornerRadius:0,fill:solid('#f8f2e8')});
Object.assign(get('n5'),{x:100,y:22,width:240,height:32,fontSize:26,fill:solid('#000000')});
Object.assign(get('n6'),{x:454,y:27,width:130,height:24,fontFamily:'Geist Mono',fontSize:14,fill:solid('#000000')});
Object.assign(get('n7'),{x:612,y:27,width:175,height:24,fontFamily:'Geist Mono',fontSize:14,fill:solid('#000000')});
const plainDesktop = label('Conversation link','Let’s talk ↗',829,27,150,24);
plainDesktop.id = 'n8';
desktop.children[desktop.children.findIndex(n=>n.id==='n8')] = plainDesktop;
desktop.children.unshift(theme(1316,24),box('Navigation bottom rule',0,71,1440,1,'#d4d7cb'));

Object.assign(get('n167'),{x:24,y:21,width:160,height:30,fontSize:24,fill:solid('#000000')});
const plainMobile = label('Conversation link','Let’s talk ↗',208,25,116,23,12);
plainMobile.id = 'n168';
mobile.children[mobile.children.findIndex(n=>n.id==='n168')] = plainMobile;
mobile.children.unshift(theme(338,20),box('Navigation bottom rule',0,61,390,1,'#d4d7cb'));
mobile.children.push(box('Opaque full-width navigation',0,0,390,62,'#f8f2e8'));

for (const id of ['n10','n28','n170','n189']) {
  for (const piece of get(id).children) piece.fill = solid(id==='n170' ? '#000000' : '#FFFFFF');
}
get('n165').fill = solid('#FFFFFF');
get('n324').fill = solid('#FFFFFF');

const copy = new Map([
  ['Hero explanation','A promising demo, an MVP or a prototype. I help turn it into production-ready software — with tested changes, stronger foundations and security built in.'],
  ['Walkthrough introduction','Maybe you vibe-coded an MVP. Maybe a developer handed over a prototype. I’m Gustav. I’ll help you understand what’s there, what needs work and how to get it ready for real use.'],
  ['Offer 2 explanation','I review your prototype’s code, data access and workflows, fix what we agree matters, and test the changes — so it can move beyond the demo and into day-to-day use.'],
  ['Offer 3 explanation','I set up an AI agent software factory to keep development moving, and a defense factory around the software to review security. Both build on reusable templates, your existing tools and human approval.'],
  ['FAQ 2 answer','We agree what production-ready means for your use case, then review the code, data access, integrations and deployment. I fix relevant findings and check the changes again. Instructions alone don’t enforce permissions, and a review isn’t a guarantee that nothing can go wrong.'],
  ['FAQ 4 answer','onlinesourdough helps you work well with AI through a practical method, resources and hands-on guidance. With Arc’IT AI, I use reusable system templates to set up and look after the software and defense factories for you.']
]);
for (const n of flat) if (copy.has(n.name)) n.content = copy.get(n.name);
get('n25').content = get('n25').name = 'A promising demo is a good start.';
get('n186').content = get('n186').name = 'A promising demo\nis a good start.';
// Make room for the explanation rather than squeezing its type.
get('n121').height = 180;
for (const n of desktop.children) if (n.y>=2383) n.y += 32;
desktop.height += 32;
get('n234').height = 160;
get('n280').height = 180;
for (const n of mobile.children) {
  const y = n.y;
  if (y>=3023) n.y += 20;
  if (y>=3528) n.y += 44;
}
mobile.height += 64;

get('n326').content = get('n326').name = 'ARC’IT AI / DRAFT 03.1 / 21 SEPTEMBER 2026';
get('n328').content = 'Practical, done-for-you help, within the existing Arc’IT identity. Refined copy, abstract offer graphics and the original logo — not a new visual direction.';
get('n331').content = 'Plain opaque navigation, wordmark only. Black or white Cut Six logo; no green mark or mascot. A promising demo, MVP or prototype is the starting point; production readiness is scoped to real use. No large factory-loop section.';
get('n337').content = 'onlinesourdough is a method for working with AI. Arc’IT implements two reusable AI-enabled systems: a software factory in the development workflow and a defense factory around the software. Templates, existing tools and human approval — not a proprietary platform.';
get('n343').content = 'Owned Arc’IT panorama and exact Cut Six geometry. Logo: black on light, white on dark — never green. Geist Pixel headings, Geist body, Geist Mono labels. Import bundled fonts through Agents & MCP → Fonts.';
get('n346').content = 'Static desktop and mobile compositions. Theme controls and motion are drawn, not working. Enforce agent access separately from instructions. Reconcile the form with the existing Worker before coding. Production and previous drafts stay unchanged.';

function logoSample(x,color) {
  const mark = structuredClone(get('n10'));
  const reId = n => { n.id=`r31-${++seq}`; (n.children ?? []).forEach(reId); };
  reId(mark);
  mark.x=x; mark.y=2184;
  for (const p of mark.children) p.fill=solid(color);
  return mark;
}
notes.height=2500;
notes.children.unshift(
  label('Monochrome logo heading','07 / LOGO FOLLOWS THE SURFACE',56,2072,870,24,14),
  label('Light surface label','LIGHT SURFACE · BLACK #000000',80,2315,390,24,12),
  label('Dark surface label','DARK SURFACE · WHITE #FFFFFF',544,2315,360,24,12,'#FFFFFF'),
  label('Logo rule','Green belongs to the landscape and accents, never to the logo.\nUse white on dark scene/video surfaces, even in the light theme.',56,2410,870,60,17,'#615f56','Geist'),
  logoSample(221,'#000000'),logoSample(685,'#FFFFFF'),
  box('Light logo specimen',56,2130,424,240,'#f8f2e8'),
  box('Dark logo specimen',520,2130,424,240,'#14211d')
);
for (const root of nodes) {
  await call('update_node',{nodeId:root.id,data:{height:root.height,children:root.children}});
  console.log(`Updated ${root.name}`);
}
await call('set_design_md',{markdown:fs.readFileSync(path.join(here,'../DESIGN.md'),'utf8')});
console.log('R3.1 native revision and embedded direction applied; save/reopen verification still required.');
