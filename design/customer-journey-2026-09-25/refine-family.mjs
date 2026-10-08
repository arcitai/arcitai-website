import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const endpoint='http://127.0.0.1:60865/mcp';
let id=0,req=0;
const C={paper:'#f8f2e8',white:'#fbfaf7',ink:'#26221e',muted:'#6b6258',line:'#e2d9cc'};
const fill=c=>[{type:'solid',color:c}];
const n=(type,name,x,y,width,height,extra={})=>({id:`personal-${++id}`,type,name,x,y,width,height,...extra});
const f=(name,x,y,w,h,c,children=[],cornerRadius=0)=>n('frame',name,x,y,w,h,{layout:'none',clipContent:true,fill:c?fill(c):[],children,cornerRadius});
const t=(content,x,y,w,h,size=18,color=C.ink,extra={})=>n('text',content.split('\n')[0],x,y,w,h,{content,fontFamily:'Geist',fontSize:size,fontWeight:400,lineHeight:1.4,textGrowth:'fixed-width-height',fill:fill(color),...extra});
const r=(name,x,y,w,h,c)=>n('rectangle',name,x,y,w,h,{fill:fill(c)});
const rule=(x,y,w)=>r('Shared fine rule',x,y,w,1,C.line);
const asset=name=>{const file=`/Users/gustavanderson/Downloads/gustavonline/public/assets/${name}`;return `data:image/${name.endsWith('.png')?'png':'jpeg'};base64,${fs.readFileSync(file).toString('base64')}`;};
const im=(name,x,y,w,h,file,mode='fill')=>n('rectangle',name,x,y,w,h,{fill:[{type:'image',url:asset(file),mode}],cornerRadius:8});
const moon=(x,y)=>n('path','Shared moon · light-theme state',x,y,18,20,{d:'M8 0A9 9 0 1 0 18 11A8 8 0 0 1 8 0Z',fill:fill(C.muted)});
const projects=[['onlinesourdough','Practical AI resources and hands-on guidance.'],['Arc’IT AI','Done-for-you AI and software for teams.'],['Kastanje AI','AI inference.']];
function compact(){const a=[im('Existing Gustav G mark',32,25,26,26,'gustav-pixel-g-384.png','fit'),t('gustavonline',68,22,310,34,22),t('Newsletter',470,28,120,26,15,C.muted),moon(615,28),rule(32,78,608),im('Gustav portrait',32,134,60,60,'gustav-portrait.jpg'),t('Gustav Anderson',114,136,502,49,34,C.ink,{fontWeight:500}),t('Founder',114,190,502,30,18,C.muted),t('YouTube ↗     Instagram ↗     LinkedIn ↗     GitHub ↗',32,280,608,36,17),rule(32,350,608)];projects.forEach(([name,desc],i)=>{const y=403+i*146;a.push(t(name,32,y,526,38,25,C.ink,{fontWeight:500}),t('↗',610,y,30,34,24),t(desc,32,y+51,608,38,18,C.muted));if(i<2)a.push(rule(32,y+108,608));});return f('Gustav Online · founder and projects · no newsletter block',64,360,672,850,C.white,a,10);}
function photo(name,x,y,w,h,file){return f(name,x,y,w+16,h+16,'#ffffff',[im(name,8,8,w,h,file)],10);}
function desktop(){const a=[im('Existing Gustav G mark',46,26,26,26,'gustav-pixel-g-384.png','fit'),t('gustavonline',88,24,500,36,22),t('Newsletter',1210,30,110,28,15,C.muted),moon(1378,31),rule(0,78,1440),t('Gustav Anderson',430,184,523,60,42,C.ink,{fontWeight:500,textAlign:'center'}),im('Existing portrait',958,184,54,54,'gustav-portrait.jpg'),t('Founder',430,267,620,32,20,C.muted,{textAlign:'center'}),t('YouTube ↗     Instagram ↗     LinkedIn ↗     GitHub ↗',410,346,620,38,18,C.ink,{textAlign:'center'}),rule(410,421,620)];
  projects.forEach(([name,desc],i)=>{const y=466+i*139;a.push(t(name,410,y,557,38,25,C.ink,{fontWeight:500}),t('↗',1000,y,30,34,24),t(desc,410,y+51,620,34,18,C.muted));if(i<2)a.push(rule(410,y+106,620));});
  a.push(photo('Existing sunny office image',30,138,146,144,'office-sun-desk.jpg'),photo('Existing window-side desk',103,372,126,99,'office-window-desk.jpg'),photo('Existing Complete Bake illustration',30,657,155,103,'onlinesourdough-complete-bake-workstation-640.png'),photo('Existing quote image',1220,149,144,184,'quote-card.png'),photo('Existing AI desk',1238,424,146,146,'office-ai-desk.jpg'),photo('Existing Arc’IT city image',1198,687,142,178,'arcitai-city-workshop-640.jpg'));
  return f('06 — Gustav Online · founder, projects and existing images',1930,3590,1440,1000,C.white,a);
}
async function call(name,args={}){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++req,method:'tools/call',params:{name,arguments:args}})});assert.ok(response.ok);const r=await response.json();assert.ok(!r.error&&!r.result?.isError,JSON.stringify(r));const str=r.result?.content?.find(c=>c.type==='text')?.text;try{return JSON.parse(str);}catch{return {text:str};}}
const candidate=path.join(dir,'brand-family-canvas-v2-owner-review.op');assert.ok(!fs.existsSync(candidate),'Refusing to overwrite v2');
const live=await call('read_nodes',{depth:-1});assert.equal(live.nodes.length,6);const family=live.nodes.find(n=>n.name==='00 — Én designfamilie · tre opgaver');assert.ok(family);
const personal=family.children.find(n=>n.name==='Gustav Online · personal overview proposal');assert.ok(personal);
function reverse(n){if(n.children){n.children.forEach(reverse);n.children.reverse();}}const compactNode=compact();const full=desktop();reverse(compactNode);reverse(full);
await call('delete_node',{nodeId:personal.id});await call('insert_node',{parent:family.id,data:compactNode,postProcess:false});
await call('insert_node',{data:full,postProcess:false});
const added=(await call('read_nodes',{depth:0})).nodes.find(n=>n.name===full.name);await call('update_node',{nodeId:added.id,data:{x:full.x,y:full.y}});
const icons=[];function walk(n,parent){if(n.type==='text'&&n.content==='☾')icons.push({n,parent});if(Array.isArray(n.children))n.children.forEach(c=>walk(c,n.id));}live.nodes.filter(n=>n.id!==personal.id).forEach(n=>walk(n,null));
for(const {n,parent} of icons){if(personal.children.some(c=>c.id===n.id))continue;await call('delete_node',{nodeId:n.id});await call('insert_node',{parent,data:moon(Math.round(n.x+4),Math.round(n.y+6)),postProcess:false});}
// Native nodes are back-to-front on insert; bring the compact preview above the canvas backdrop.
const updated=(await call('read_nodes',{depth:-1})).nodes.find(n=>n.id===family.id);const preview=updated.children.find(n=>n.name===compactNode.name);await call('move_node',{nodeId:preview.id,parent:family.id,index:'0'});
await call('set_design_md',{markdown:fs.readFileSync(path.join(dir,'DESIGN.md'),'utf8')});
await call('save_document',{filePath:candidate});
const after=await call('read_nodes',{depth:-1});let count=0;function countNodes(n){count++;if(Array.isArray(n.children))n.children.forEach(countNodes);}after.nodes.forEach(countNodes);console.log(JSON.stringify({candidate,nodes:count,boards:after.nodes.map(n=>n.name)}));
