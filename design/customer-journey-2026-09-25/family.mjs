import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const endpoint='http://127.0.0.1:60865/mcp';
const C={paper:'#f8f2e8',white:'#fbfaf7',ink:'#26221e',muted:'#6b6258',line:'#e2d9cc',brown:'#856344',green:'#236b59'};
const asset=(file)=>`data:image/${file.endsWith('.png')?'png':'jpeg'};base64,${fs.readFileSync(file).toString('base64')}`;
const day=asset(path.resolve(dir,'../../public/assets/arcitai-day-poster-v6.jpg'));
const portrait=asset('/Users/gustavanderson/Downloads/gustavonline/public/assets/gustav-portrait.jpg');
const assets=['content','resources','inner-circle','complete-bake'].map(s=>asset(`/Users/gustavanderson/Downloads/onlinesourdough/public/assets/${s}-lofi-v3-transparent.png`));
let id=0,req=0;
const fill=c=>[{type:'solid',color:c}];
const n=(type,name,x,y,width,height,extra={})=>({id:`family-${++id}`,type,name,x:Math.round(x),y:Math.round(y),width:Math.round(width),height:Math.round(height),...extra});
const r=(name,x,y,w,h,c,cornerRadius=0)=>n('rectangle',name,x,y,w,h,{fill:fill(c),cornerRadius});
const f=(name,x,y,w,h,c,children=[],cornerRadius=0)=>n('frame',name,x,y,w,h,{layout:'none',clipContent:true,fill:c?fill(c):[],children,cornerRadius});
const t=(content,x,y,w,h,size=18,color=C.ink,extra={})=>n('text',content.split('\n')[0],x,y,w,h,{content,fontFamily:'Geist',fontSize:size,fontWeight:400,lineHeight:1.4,textGrowth:'fixed-width-height',fill:fill(color),...extra});
const p=(content,x,y,w,h,size=36)=>t(content,x,y,w,h,size,C.ink,{fontFamily:'Geist Pixel',lineHeight:1.08});
const rule=(y)=>r('Shared thin rule',32,y,608,1,C.line);
const im=(name,x,y,w,h,url,mode='fill',radius=8)=>n('rectangle',name,x,y,w,h,{fill:[{type:'image',url,mode}],cornerRadius:radius});
const btn=(content,x,y,w=252,h=52)=>f(content,x,y,w,h,C.ink,[t(content,14,16,w-28,28,16,C.paper,{fontWeight:500,textAlign:'center'})],5);
function header(name,personal=false){return[t(name,32,24,345,34,22,C.ink),t(personal?'Writing':'Offers ⌄',485,28,90,28,15,C.muted),t('☾',613,21,30,36,24,C.ink),rule(78)];}
function personal(){const a=header('gustavonline',true);a.push(im('Gustav — existing public portrait',32,132,58,58,portrait),t('Gustav Anderson',112,131,475,48,34,C.ink,{fontWeight:500}),t('Business & software architect',112,179,475,32,17,C.muted),t('I explore practical AI, useful software and\nbetter ways of working. Here’s what I’m\nbuilding, sharing and working on.',32,250,608,104,22,C.muted),t('YouTube ↗       LinkedIn ↗       Instagram ↗',32,382,608,30,17,C.ink),rule(442),p('Explore my work.',32,484,608,48,32));
  [['onlinesourdough','Resources and hands-on help for your business.'],['Arc’IT AI','AI and software delivery for companies and teams.'],['Open source','The tools and methods I share on GitHub.']].forEach(([name,body],i)=>{const y=578+i*119;a.push(t(name,32,y,540,37,24,C.ink,{fontWeight:500}),t('↗',608,y,36,36,25,C.ink),t(body,32,y+44,608,40,17,C.muted),rule(y+94));});
  a.push(p('Notes from the work.',32,976,608,42,30),t('Experiments, workflows and lessons from\nmaking AI useful in a real business.',32,1040,608,66,18,C.muted),r('Email field',32,1136,396,52,'#ffffff',4),t('Email address',48,1152,360,26,17,C.muted),btn('Join free',444,1136,196),rule(1250),t('hello@gustavonline.com',32,1280,608,28,16,C.muted));return f('Gustav Online · personal overview proposal',64,360,672,1350,C.white,a,10);}
function menuCard(title,kind,body,url,action,x,y){return f(title,x,y,290,348,'#fffcf7',[t(kind,20,18,250,24,14,C.brown),t(title,20,55,250,34,23,C.ink,{fontWeight:500}),t(body,20,104,250,52,16,C.muted),im('Existing sourdough illustration',20,164,250,124,url,'fit',0),t(action+' ↗',20,306,250,28,16,C.ink,{fontWeight:500})],10);}
function sourdough(){const a=[];for(let x=0;x<672;x+=56)a.push(r('Quiet source grid',x,80,1,1169,'#eee7dc'));for(let y=80;y<1249;y+=56)a.push(r('Quiet source grid',0,y,672,1,'#eee7dc'));a.push(...header('onlinesourdough'),p('Build the business\nyou want to run.',32,132,608,110,42),t('Practical ways to use AI in your business.\nStart with the resources, work alongside me,\nor have me take care of the implementation.',32,270,608,94,19,C.muted));
  const offers=[['Content','Public','Ideas, experiments and\nexamples from real work.','Explore content'],['Resources','DIY','Free guides, examples\nand ways to get started.','Open library'],['The Fermentary','DWY','Build your way of working\nwith AI, alongside Gustav.','Work together'],['Complete Bake','DFY','Done for you by Arc’IT AI.\nA solution delivered for you.','Explore Arc’IT AI']];
  offers.forEach(([title,kind,body,action],i)=>a.push(menuCard(title,kind,body,assets[i],action,32+(i%2)*318,422+Math.floor(i/2)*380)));
  a.push(rule(1250),t('gustavonline ↗',32,1280,300,28,16,C.muted),t('Arc’IT AI ↗',492,1280,150,28,16,C.muted));return f('Online Sourdough · existing family adapted',784,360,672,1350,C.paper,a,10);}
function mark(x,y,size){const s=size/60;const polys=[[[26,2],[40,2],[34,16],[20,16]],[[19,18],[33,18],[27,32],[13,32]],[[12,34],[26,34],[20,48],[6,48]],[[42,2],[56,2],[56,16],[42,16]],[[36,18],[50,18],[50,32],[36,32]],[[48,34],[62,34],[62,48],[48,48]]];return f('Original monochrome Cut Six',x,y,size,size,null,polys.map((ps,i)=>{const mx=Math.min(...ps.map(v=>v[0])),my=Math.min(...ps.map(v=>v[1]));return n('path',`Cut Six ${i+1}`,(mx-4)*s,(my+4)*s,(Math.max(...ps.map(v=>v[0]))-mx)*s,14*s,{d:ps.map(([px,py],j)=>`${j?'L':'M'}${(px-mx)*s} ${(py-my)*s}`).join(' ')+'Z',fill:fill('#ffffff')});}));}
function arcit(){const a=header('Arc’IT AI');a.push(p('AI and software,\ndone for your team.',32,132,608,110,42),t('From a promising demo to software your team\ncan use. I handle the agreed work and set up\nthe agents and checks around it.',32,270,608,94,19,C.muted),im('Proposed walkthrough — not a recorded VSL',32,422,608,342,day),mark(280,482,112),f('Visible video action',205,677,262,48,C.paper,[t('▶   Watch the walkthrough',12,13,238,26,16,C.ink,{textAlign:'center'})],5),btn('Discuss your project ↗',206,800,260));
  a.push(rule(906));
  [['One-off consultation','A question or blocker.\nA clear next step.'],['Review & delivery','Review what you have.\nTake care of the next release.']].forEach(([title,body],i)=>{const x=32+i*318;for(let j=0;j<7;j++)a.push(r('Accepted abstract motif',x+j*36,950+(i?0:(j%3)*8),i?19:5,i?26:5,j===3?C.green:'#a9bba9',i?2:0));a.push(t(title,x,1010,290,34,22,C.ink,{fontWeight:500}),t(body,x,1058,290,66,17,C.muted));});
  a.push(t('AI agent factory setup',32,1164,608,32,23,C.ink,{fontWeight:500}),t('Development and defence, configured around your software.',32,1206,608,34,17,C.muted),rule(1250),t('Done for you by Gustav.',32,1280,335,28,16,C.muted),t('All offers ↗',519,1280,123,28,16,C.muted));return f('Arc’IT AI · same family, delivery job',1504,360,672,1350,C.paper,a,10);}
async function call(name,args={}){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++req,method:'tools/call',params:{name,arguments:args}})});assert.ok(response.ok);const r=await response.json();assert.ok(!r.error&&!r.result?.isError,JSON.stringify(r));const str=r.result?.content?.find(c=>c.type==='text')?.text;try{return JSON.parse(str);}catch{return {text:str};}}
const candidate=path.join(dir,'brand-family-canvas-owner-review.op');
assert.ok(!fs.existsSync(candidate),'Refusing to overwrite family candidate');
const before=await call('read_nodes',{depth:-1});
assert.equal(before.nodes.length,5);
assert.ok(before.nodes.find(n=>n.name.startsWith('01 — Gustav')));
const all=[];function flatten(n){all.push(n);if(Array.isArray(n.children))n.children.forEach(flatten);}before.nodes.forEach(flatten);
const board=f('00 — Én designfamilie · tre opgaver',0,0,2240,1900,'#ebe6dd',[
  t('Én familie. Tre forskellige opgaver.',64,52,2080,83,58,C.ink,{fontWeight:500,lineHeight:1.05}),
  t('Samme papir, typografi og ro. Forskelligt indhold — ingen obligatorisk tur gennem alle tre sites.',64,170,2080,48,27,C.muted),
  t('01   GUSTAV ONLINE · TILLID',64,280,672,36,22,C.ink,{fontWeight:500}),
  t('02   ONLINE SOURDOUGH · VALG',784,280,672,36,22,C.ink,{fontWeight:500}),
  t('03   ARC’IT AI · LEVERING',1504,280,672,36,22,C.ink,{fontWeight:500}),
  personal(),sourdough(),arcit(),
  t('Fælles grunddesign',64,1774,560,50,30,C.ink,{fontWeight:500}),
  t('Geist + Pixel     ·     Fine linjer     ·     Papirflader     ·     Rolig navigation     ·     Én tydelig næste handling',64,1832,2080,40,24,C.muted)
]);
function reverse(n){if(n.children){n.children.forEach(reverse);n.children.reverse();}}reverse(board);
await call('insert_node',{data:board,postProcess:false});
for(const b of before.nodes){const index=Number(b.name.slice(0,2));await call('update_node',{nodeId:b.id,data:{x:index<=3?(index-1)*1750:index===4?0:1430,y:index<=3?2100:3590}});}
for(const b of before.nodes.filter(n=>/^0[45] —/.test(n.name))){const descendants=[];function walk(n){descendants.push(n);if(Array.isArray(n.children))n.children.forEach(walk);}walk(b);for(const n of descendants){let data=null;if(n.type==='text'&&/^AI and software,|^done for your team\./.test(n.content))data={fontFamily:'Geist Pixel',textAlign:'left',...(b.name.startsWith('04')?{x:200,width:880}:{})};if(n.type==='frame'&&(/Discuss your project|Proposed walkthrough play control|Visible touch play control/.test(n.name)))data={cornerRadius:5};if(n.type==='text'&&n.content==='Arc’IT AI')data={fontFamily:'Geist',fontSize:b.name.startsWith('04')?26:24};if(n.type==='text'&&n.content?.startsWith('From a promising demo')&&b.name.startsWith('04'))data={x:200,width:880,textAlign:'left'};if(n.type==='text'&&n.content==='All offers ↗'&&b.name.startsWith('05'))data={x:212,width:111,fontSize:14};if(data)await call('update_node',{nodeId:n.id,data});}
  if(b.name.startsWith('05'))await call('insert_node',{parent:b.id,data:t('☾',343,27,26,34,23,C.ink),postProcess:false});
}
await call('set_design_md',{markdown:fs.readFileSync(path.join(dir,'DESIGN.md'),'utf8')});
await call('save_document',{filePath:candidate});
const out=await call('read_nodes',{depth:-1});let count=0;function countNode(n){count++;if(Array.isArray(n.children))n.children.forEach(countNode);}out.nodes.forEach(countNode);console.log(JSON.stringify({candidate,nodes:count,boards:out.nodes.map(n=>({name:n.name,x:n.x,y:n.y}))}));
