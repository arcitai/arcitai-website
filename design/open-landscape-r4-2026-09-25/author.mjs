import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../..');
const endpoint = 'http://127.0.0.1:60865/mcp';
const C = {paper:'#f8f2e8',ink:'#18211d',muted:'#615f56',green:'#236b59',sage:'#b9d9c8',line:'#d9dbcf',dark:'#171814',light:'#f5f1e8'};
const dataImage = file => `data:image/jpeg;base64,${fs.readFileSync(path.join(root,'public/assets',file)).toString('base64')}`;
const day = dataImage('arcitai-day-poster-v6.jpg');
const night = dataImage('arcitai-panorama-night-v1.jpg');
let id = 0, request = 0;
const fill = color => [{type:'solid',color}];
const n = (type,name,x,y,width,height,more={}) => ({id:`r4-${++id}`,type,name,x,y,width,height,...more});
const box = (name,x,y,w,h,color,r=0) => n('rectangle',name,x,y,w,h,{fill:fill(color),cornerRadius:r});
const frame = (name,x,y,w,h,color,children=[],r=0) => n('frame',name,x,y,w,h,{layout:'none',clipContent:true,fill:color?fill(color):[],children,cornerRadius:r});
const txt = (content,x,y,w,h,size=18,color=C.ink,more={}) => n('text',content.split('\n')[0],x,y,w,h,{content,fontFamily:'Geist',fontSize:size,fontWeight:400,lineHeight:1.45,textGrowth:'fixed-width-height',fill:fill(color),...more});
const title = (content,x,y,w,h,size=48,color=C.ink) => txt(content,x,y,w,h,size,color,{fontWeight:500,lineHeight:1.04,letterSpacing:-1.5});
const pixel = (content,x,y,w,h,size=40,color=C.ink) => txt(content,x,y,w,h,size,color,{fontFamily:'Geist Pixel',lineHeight:1.1});
const mono = (content,x,y,w,h,size=13,color=C.muted) => txt(content,x,y,w,h,size,color,{fontFamily:'Geist Mono',lineHeight:1.3});
const image = (name,x,y,w,h,url=day,r=20) => n('rectangle',name,x,y,w,h,{fill:[{type:'image',url,mode:'fill'}],cornerRadius:r});
const disk = (name,x,y,d,color) => n('ellipse',name,x,y,d,d,{fill:fill(color)});
function mark(x,y,size,color='#ffffff') {
  const s=size/60;
  const polys=[[[26,2],[40,2],[34,16],[20,16]],[[19,18],[33,18],[27,32],[13,32]],[[12,34],[26,34],[20,48],[6,48]],[[42,2],[56,2],[56,16],[42,16]],[[36,18],[50,18],[50,32],[36,32]],[[48,34],[62,34],[62,48],[48,48]]];
  return frame('Cut Six — original six editable pieces',x,y,size,size,null,polys.map((p,i)=>{
    const minX=Math.min(...p.map(a=>a[0])),minY=Math.min(...p.map(a=>a[1]));
    return n('path',`Cut Six piece ${i+1}`,(minX-4)*s,(minY+4)*s,(Math.max(...p.map(a=>a[0]))-minX)*s,14*s,{d:p.map(([px,py],i)=>`${i?'L':'M'}${(px-minX)*s} ${(py-minY)*s}`).join(' ')+'Z',fill:fill(color)});
  }));
}
function cta(text,x,y,w=245,dark=false) {
  const bg=dark?C.light:C.ink,fg=dark?C.ink:C.light;
  return frame(text,x,y,w,58,bg,[txt(text,24,17,w-78,26,16,fg,{fontWeight:500}),disk('Action arrow inset',w-49,9,40,C.sage),txt('↗',w-40,12,26,32,25,C.ink)],29);
}
function header(dark=false,mobile=false) {
  const fg=dark?C.light:C.ink,bg=dark?C.light:C.ink,navfg=dark?C.ink:C.light;
  if(mobile) return [pixel('Arc’IT AI',24,26,160,32,26,fg),frame('Opaque mobile navigation',204,20,162,44,bg,[mono('Offers ⌄',14,14,74,22,12,navfg),mono('Start ↗',99,14,60,22,12,navfg)],22)];
  return [pixel('Arc’IT AI',80,36,220,42,30,fg),frame('Opaque navigation capsule',568,24,610,64,bg,[mono('Offers ⌄',32,24,110,24,14,navfg),mono('Process',180,24,96,24,14,navfg),mono('Scope',312,24,85,24,14,navfg),box('Start action surface',450,8,152,48,dark?'#d9dfd5':'#303c34',24),mono('Start ↗',488,24,93,24,14,navfg)],32),disk('Theme control outline',1306,34,44,dark?'#30332c':'#eee8dc'),txt(dark?'☀':'☾',1318,39,25,32,23,fg)];
}
function hero(dark=false) {
  const fg=dark?C.light:C.ink,muted=dark?'#bbb9ae':C.muted;
  return [...header(dark),title('From prototype\nto production-\nready software.',80,170,736,254,76,fg),txt('You’ve built something that works. I help get it ready for real use — and set up AI agents to keep development and security work moving, with the right checks in place.',84,466,580,128,20,muted),cta('Discuss a project',80,640,258,dark),txt('Meet Gustav ↓',368,655,196,30,17,fg,{fontWeight:500}),image('Unobscured landscape — existing scene loop placement',810,130,550,638,dark?night:day,24),mark(934,212,302),frame('Solid caption cutout',838,644,324,96,dark?C.dark:C.paper,[pixel('Business first.\nSecurity built in.',20,16,290,72,26,fg)],12),box('Opening baseline',80,828,1280,1,dark?'#393d35':C.line)];
}
function motif(kind,x,y,w=560,h=140) {
  const a=[box('Shared guide',24,h/2,w-48,1,C.line)];
  if(kind==='focus') {
    [[66,34],[112,89],[203,49],[269,61],[333,93],[430,31],[483,86]].forEach(([px,py],i)=>a.push(box(`Gathering square ${i+1}`,px,py,8,8,i===3?C.green:'#92ae9b')));
    a.push(n('path','Focus brackets',253,46,54,46,{d:'M0 10V0H14M40 0H54V10M54 36V46H40M14 46H0V36',stroke:{fill:fill(C.green),thickness:2},fill:[]}));
  } else {
    for(let r=0;r<2;r++)for(let c=0;c<7;c++)a.push(box(`Review tile ${r}.${c}`,100+c*48,28+r*52,30,30,r===1&&c===3?C.green:'#dce5d9',3));
    a.push(box('Existing review scan placement',283,12,2,116,C.green));
  }
  return frame(`${kind} — still state of existing animation`,x,y,w,h,null,a);
}
function pipe(x,y,w=1168,h=220) {
  const a=[];
  const stages=['Scope & access','Code & tests','Review & defence','Approval & handoff'];
  stages.forEach((label,i)=>{const px=i*w/4;a.push(mono(label,px+12,12,w/4-24,28,14,C.muted));a.push(box(`Stage ${i+1} progress track`,px+12,182,w/4-32,5,'#dde4d8',2));a.push(box(`Stage ${i+1} filled progress`,px+12,182,w/4-32,5,C.green,2));});
  a.push(n('path','Continuous pipe — open state',0,68,w,86,{d:`M0 0C${w*.3} 0 ${w*.3} 4 ${w*.5} 4S${w*.8} 0 ${w} 0M0 86C${w*.3} 86 ${w*.3} 82 ${w*.5} 82S${w*.8} 86 ${w} 86`,fill:[],stroke:{fill:fill('#88a794'),thickness:2}}));
  for(let i=0;i<28;i++)a.push(box(`Flow square ${i+1}`,i*(w/28)+6,99+(i%3-1)*13,6,6,i%4?C.green:'#a3b9a7',1));
  return frame('Accepted factory pipeline — open-state storyboard',x,y,w,h,null,a);
}
function desktop() {
  const a=hero();
  a.push(pixel('Start with\nwhat you’ve built.',80,940,476,116,44),txt('Maybe you’ve vibe-coded a promising demo. Maybe a developer built your MVP. I’m Gustav. I look at what it needs to do for your business, work through the gaps, and take care of the implementation — from the first review to the way it’s maintained.',84,1092,462,204,19,C.muted));
  a.push(image('Same-scene player — existing rounded 16:9 frame',634,934,726,408,day,14),frame('Play video — hover / focus state',908,1104,186,58,C.paper,[txt('▶   Play video',22,17,150,26,17,C.ink)],29));
  a.push(box('Offers rule',80,1454,1280,1,C.line),pixel('The work I take care of.',80,1522,860,64,50),txt('Solve a specific problem, get ready for production, or put a repeatable setup in place.',84,1610,780,60,20,C.muted));
  const offers=[['One-off AI consultation.','A clear next step for a specific problem.','Bring a question, a blocker or a setup you’re unsure about. We work through it together and decide what’s worth doing next.','Discuss a consultation ↗'],['Software review & delivery.','Take a working prototype into day-to-day use.','I review the code, permissions and integrations in what you’ve built. Then I fix the agreed issues, test the changes and help get it released.','Discuss a review ↗']];
  offers.forEach((o,i)=>{const x=80+i*680;a.push(motif(i?'review':'focus',x,1720,600,150),box('Offer rule',x,1902,600,1,C.line),title(o[0],x,1946,600,50,34),txt(o[1],x,2014,580,48,19,C.ink),txt(o[2],x,2084,568,116,18,C.muted),txt(o[3],x,2230,540,32,17,C.green,{fontWeight:500}));});
  const f=[];
  f.push(pixel('AI agent\nfactory setup.',48,48,456,122,46),txt('A repeatable way to develop and look after your software.',548,52,640,64,25,C.ink),txt('I set up the agents, instructions and checks around your code, so the next change has a clear path from a scoped task to a reviewed release.',548,134,625,108,18,C.muted),pipe(48,290));
  const scope=[['Agent Software Factory','Agents work through scoped tasks, tests and code review in your codebase. I set up the instructions and checks before changes move on.'],['Agent Defense Factory','A separately scoped workflow to assess security findings around your software, prioritise them and work through agreed fixes.'],['Local AI, where it fits','Use local models where your hardware and the work suit them. We decide what stays local and what uses a cloud model.'],['Data access & retention','Decide what agents can access, where data is processed and how long prompts, outputs and logs are kept. I configure the available controls and document the limits of the tools and providers we choose.']];
  scope.forEach(([h,b],i)=>{const yy=548+i*124;f.push(box('Scope row rule',48,yy,1184,1,'#c9d7ca'),txt(h,48,yy+25,388,38,20,C.ink,{fontWeight:500}),txt(b,452,yy+25,748,94,18,C.muted));});
  f.push(box('Factory close rule',48,1078,1184,1,'#c9d7ca'),txt('I handle the setup and agreed ongoing work. You keep control of scope, access and release approvals.',48,1114,740,75,18,C.muted),cta('Discuss a setup',978,1114,254));
  a.push(frame('Full-width factory offer — existing content and pipeline',80,2388,1280,1230,'#e9eee4',f,22));
  a.push(txt('Project inquiry continues with the accepted R3.9 form, open FAQs and landscape footer.',80,3680,1150,50,18,C.muted));
  return frame('01 — Desktop / Open landscape',0,0,1440,3790,C.paper,a);
}
function mobile() {
  const a=header(false,true);
  a.push(title('From prototype\nto production-\nready software.',24,118,342,151,42),txt('You’ve built something that works. I help get it ready for real use — and set up AI agents to keep development and security work moving, with the right checks in place.',24,299,342,150,17,C.muted),cta('Discuss a project',24,478,240),txt('Meet Gustav ↓',24,556,240,30,17,C.ink),image('Mobile landscape — no dark overlay',24,622,342,360,day,18),mark(106,668,180),frame('Mobile caption cutout',40,890,262,72,C.paper,[pixel('Business first.\nSecurity built in.',16,12,237,56,22)],10));
  a.push(pixel('Start with\nwhat you’ve built.',24,1058,342,92,34),txt('Maybe you’ve vibe-coded a promising demo. Maybe a developer built your MVP. I’m Gustav. I look at what it needs to do for your business, work through the gaps, and take care of the implementation — from the first review to the way it’s maintained.',24,1184,342,232,17,C.muted),image('Mobile scene player — 16:9',24,1450,342,192,day,10),frame('Always-visible touch play',112,1524,166,48,C.paper,[txt('▶   Play video',18,12,132,24,16,C.ink)],24),box('Mobile offers rule',24,1718,342,1,C.line),pixel('The work\nI take care of.',24,1770,342,92,36),txt('Solve a specific problem, get ready for production, or put a repeatable setup in place.',24,1892,342,92,17,C.muted));
  a.push(motif('focus',24,2020,342,130),title('One-off AI\nconsultation.',24,2190,342,81,32),txt('A clear next step for a specific problem.',24,2300,342,62,18),txt('Bring a question, a blocker or a setup you’re unsure about. We work through it together and decide what’s worth doing next.',24,2380,342,144,17,C.muted),txt('Discuss a consultation ↗',24,2550,342,30,17,C.green));
  a.push(box('Second mobile offer rule',24,2638,342,1,C.line),motif('review',24,2688,342,130),title('Software review\n& delivery.',24,2850,342,90,32),txt('Take a working prototype into day-to-day use.',24,2970,342,68,18),txt('I review the code, permissions and integrations in what you’ve built. Then I fix the agreed issues, test the changes and help get it released.',24,3060,342,151,17,C.muted),txt('Discuss a review ↗',24,3240,342,30,17,C.green));
  return frame('03 — Mobile / 390',3120,0,390,3340,C.paper,a);
}
function notes() {
  return frame('04 — Motion and retained foundations',1580,1100,1440,1230,C.paper,[
    pixel('The same moving parts.\nA different opening.',64,62,1250,124,48),txt('Composition study — not an animated or functional webpage.',68,224,1170,35,20,C.muted),
    mark(116,348,164,C.ink),title('Original mark',390,340,500,48,30),txt('Reuse the six-piece assembly. The mark is larger, but its movement stays small and slow. White on the hero image; black on paper. No mascot.',390,406,880,116,20,C.muted),
    image('Unobscured existing scene',64,610,282,160,day,12),title('Existing scene and player',390,594,866,48,30),txt('Use the day/evening loops already received. Hero and player share the selected scene. No new dark overlay. Keep reduced-motion stills and visibility pause.',390,660,880,120,20,C.muted),
    pipe(64,878,1280,210),txt('Retain the continuous squeezed pipe, incoming squares and reversible scroll/hover behavior. This board shows only its open state.',64,1120,1270,76,18,C.muted)
  ]);
}
async function call(name,args={}) {
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++request,method:'tools/call',params:{name,arguments:args}})});
  assert.ok(response.ok,`${name}: HTTP ${response.status}`);
  const result=await response.json();
  assert.ok(!result.error&&!result.result?.isError,JSON.stringify(result));
  const value=result.result?.content?.find(c=>c.type==='text')?.text;
  try{return JSON.parse(value);}catch{return {text:value};}
}
const existing=await call('read_nodes',{depth:0});
assert.equal(existing.nodes.length,1);
assert.equal(existing.nodes[0].name,'Arc’IT AI · R3 · Editable landing draft');
const boards=[desktop(),frame('02 — Dark / Hero study',1580,0,1440,900,C.dark,hero(true)),mobile(),notes()];
function reversePaint(node){if(node.children){node.children.forEach(reversePaint);node.children.reverse();}return node;}
boards.forEach(reversePaint);
await call('delete_node',{nodeId:existing.nodes[0].id});
for(const data of boards) await call('insert_node',{data,postProcess:false});
const live=await call('read_nodes',{depth:0});
for(const board of boards){const node=live.nodes.find(n=>n.name===board.name);assert.ok(node);await call('update_node',{nodeId:node.id,data:{x:board.x,y:board.y}});}
await call('set_design_md',{markdown:fs.readFileSync(path.join(dir,'DESIGN.md'),'utf8')});
await call('set_viewport',{pan_x:'80',pan_y:'50',zoom_percent:'70'});
// Persist the daemon snapshot so the browser can reopen this exact candidate.
const candidate=path.join(dir,'arcitai-open-landscape-r4.op');
assert.ok(!fs.existsSync(candidate),'Refusing to overwrite an existing candidate');
await call('save_document',{filePath:candidate});
console.log(JSON.stringify({candidate,nodes:id,boards:boards.map(n=>n.name)}));
