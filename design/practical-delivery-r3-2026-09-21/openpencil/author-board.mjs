// Author the selected Arc’IT draft through the visible, isolated native editor.
// No production writes. Run once against the inspected private seed document.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const endpoint = process.env.ARCIT_PENCIL_MCP ?? 'http://127.0.0.1:59404/mcp';
const C = { paper:'#f8f2e8', cream:'#fffaf1', ink:'#18211d', muted:'#615f56', green:'#236b59', dark:'#14211d', sage:'#b9d9c8', pale:'#e6eee5', rule:'#d4d7cb' };
const scene = `data:image/jpeg;base64,${fs.readFileSync(path.join(root,'public/assets/arcitai-panorama-day-v1.jpg')).toString('base64')}`;
const solid = color => [{type:'solid',color}];
let seq=0;
const node = (type,name,x,y,width,height,extra={}) => ({id:`arcit-r3-${++seq}`,type,name,x,y,width,height,...extra});
const box = (name,x,y,w,h,color,r=0) => node('rectangle',name,x,y,w,h,{fill:solid(color),cornerRadius:r});
const frame = (name,x,y,w,h,color,children=[]) => node('frame',name,x,y,w,h,{layout:'none',clipContent:true,fill:color?solid(color):[],children});
const text = (name,content,x,y,w,h,size=18,color=C.ink,font='Geist',extra={}) => node('text',name,x,y,w,h,{content,fontFamily:font,fontSize:size,fontWeight:400,lineHeight:1.35,textGrowth:'fixed-width-height',fill:solid(color),...extra});
const title = (content,x,y,w,h,size=44,color=C.ink,align='left') => text(content,content,x,y,w,h,size,color,'Geist Pixel',{lineHeight:1.08,textAlign:align});
const label = (content,x,y,w,color=C.muted,align='left',size=11) => text(content,content,x,y,w,20,Math.max(11,size),color,'Geist Mono',{textAlign:align,letterSpacing:0.6});
const link = (content,x,y,w,color=C.green,size=16) => text(content,content,x,y,w,28,size,color,'Geist',{fontWeight:500});
const circle = (name,x,y,d,color) => node('ellipse',name,x,y,d,d,{fill:solid(color)});
const button = (content,x,y,w,{light=false,small=false}={}) => frame(content,x,y,w,small?38:54,light?C.cream:C.green,[text('Button label',content,12,small?9:16,w-24,24,small?14:16,light?C.dark:C.cream,'Geist',{textAlign:'center',fontWeight:500})]);
const image = (name,x,y,w,h) => node('rectangle',name,x,y,w,h,{fill:[{type:'image',url:scene,mode:'fill'}]});
function mark(x,y,size,color=C.cream){
  // Exact Cut Six silhouette, transformed from the owned SVG viewBox 4 -4 60 60.
  const s=size/60;
  const polys=[[[26,2],[40,2],[34,16],[20,16]],[[19,18],[33,18],[27,32],[13,32]],[[12,34],[26,34],[20,48],[6,48]],[[42,2],[56,2],[56,16],[42,16]],[[36,18],[50,18],[50,32],[36,32]],[[48,34],[62,34],[62,48],[48,48]]];
  return frame('Original Arc’IT Cut Six · six editable pieces',x,y,size,size,null,polys.map((p,i)=>{
    const minX=Math.min(...p.map(p=>p[0])),minY=Math.min(...p.map(p=>p[1]));
    const w=(Math.max(...p.map(p=>p[0]))-minX)*s,h=14*s;
    const d=p.map(([px,py],k)=>`${k?'L':'M'}${(px-minX)*s} ${(py-minY)*s}`).join(' ')+'Z';
    return node('path',`Cut Six ${i+1}`,(minX-4)*s,(minY+4)*s,w,h,{d,fill:solid(color)});
  }));
}
function motif(kind,x,y,w=240,h=130){
  const a=[];
  if(kind===0){
    const pts=[[20,45,4],[50,22,5],[73,87,5],[111,61,8],[116,22,4],[149,41,6],[173,87,4],[203,62,4],[87,47,6],[130,85,5],[180,26,3],[41,82,3]];
    pts.forEach(([px,py,r],i)=>a.push(circle(`Gathering point ${i+1}`,px,py,r*2,i===3?C.green:i%3===0?C.sage:C.ink)));
  } else if(kind===1){
    [[50,22,86,C.sage],[72,13,104,C.green],[96,31,73,C.ink]].forEach(([px,py,d,c],i)=>{
      a.push(circle(`Alignment ring ${i+1}`,px,py,d,c));
      a.push(circle(`Ring opening ${i+1}`,px+1.6,py+1.6,d-3.2,C.paper));
    });
    a.push(circle('Review focus',118,58,8,C.green));
  } else {
    for(let row=0;row<5;row++)for(let col=0;col<8;col++){
      const accent=col===(row+3)%8;
      a.push(box(`Paced stroke ${row+1}.${col+1}`,16+col*26,22+row*20,accent?17:12,3,accent?C.green:row%2?C.sage:'#adb9ab',1));
    }
  }
  return frame(['Focus · point study','Review · ring study','Continuity · stroke study'][kind],x,y,w,h,null,a);
}
function video(x,y,w,h,mobile=false){
  const ch=[mark(26,24,mobile?30:43,C.sage),label('FOUNDER WALKTHROUGH',mobile?67:88,31,w-130,C.sage,'left',mobile?9:11)];
  if(!mobile) ch.push(box('Unrecorded film label',w-213,24,184,28,'#2c4237',4),label('FILM TO BE RECORDED',w-203,31,168,C.cream,'center',9));
  const d=mobile?44:66;
  ch.push(circle('Play placement only',w/2-d/2,mobile?80:135,d,'#b9d9c8'),node('path','Play triangle',w/2-5,mobile?94:157,16,22,{d:'M0 0L16 11L0 22Z',fill:solid(C.dark)}));
  ch.push(title('Let’s look at\nwhat you’ve built.',mobile?24:44,mobile?151:275,w-70,mobile?64:110,mobile?24:39,C.cream));
  if(mobile)ch.push(label('FILM TO BE RECORDED',24,h-31,w-48,C.sage,'left',9));
  else ch.push(label('A CONVERSATION ABOUT YOUR EXISTING SETUP',44,h-38,w-88,C.sage,'left',10));
  return frame('VSL placement · unrecorded film',x,y,w,h,C.dark,ch);
}
const offers=[
  {eyebrow:'01 / A FOCUSED SESSION',heading:'Talk it through.',body:'Bring a question, a half-finished build or a decision you’re stuck on. We’ll look at what you have and work out a sensible next step.',cta:'Talk through your question ↗'},
  {eyebrow:'02 / HANDS-ON DELIVERY',heading:'Review and improve it.',body:'I review the code, data access and workflows, fix what we agree matters, and test the changes. Clearer foundations for the work your team relies on.',cta:'Tell me what you’ve built ↗'},
  {eyebrow:'03 / A REPEATABLE SETUP',heading:'Keep the work moving.',body:'I set up the instructions, skills, tests and review steps your agents need to work through agreed tasks. Clear limits on what they can do, and a person deciding what goes live.',cta:'Talk about your workflow ↗'}
];
const faqs=[
 ['Do I need another platform?','Often we can use what you already have — such as Codex or Cursor — with better instructions, skills, tests and review. I recommend additional software only where the work needs it.'],
 ['What do you check?','The code, data access, integrations and the things that could go wrong. We agree the scope, fix relevant findings and check the changes again. Instructions alone don’t enforce permissions, and a review isn’t a guarantee that nothing can go wrong.'],
 ['Can you keep looking after it?','Yes. We agree what I’m responsible for, how changes are reviewed and what ongoing support includes. It can be a focused piece of work or a longer collaboration.'],
 ['Prefer to build it yourself?','Explore onlinesourdough for resources and hands-on guidance. The difference is who takes care of the delivery, not whether security matters.']
];
function field(name,x,y,w,h=54){return [text(`${name} label`,name,x,y,w,27,16),box(`${name} field`,x,y+35,w,h,C.cream,3),box(`${name} baseline`,x,y+35+h-1,w,1,'#9fb3a6')];}
function inquiryForm(x,y,w,mobile=false){
  const p=mobile?0:28,iw=w-p*2,a=[];
  const off=mobile?0:26;
  a.push(...field('Name',p,off,iw),...field('Work email',p,off+112,iw),...field('Company (optional)',p,off+224,iw));
  a.push(text('Project context label','What have you built, and what\nwould you like help with?',p,off+344,iw,58,16),box('Project context field',p,off+410,iw,mobile?182:195,C.cream,3),box('Project context baseline',p,off+410+(mobile?181:194),iw,1,'#9fb3a6'));
  a.push(text('Privacy note','A high-level description is enough. Please don’t include credentials or confidential business or customer data.',p,off+(mobile?617:628),iw,78,14,C.muted));
  a.push(button('Send a project inquiry ↗',p,off+(mobile?714:720),iw));
  a.push(label('DESIGN ONLY · NO MESSAGE IS SENT',p,off+(mobile?788:797),iw,C.muted,'left',9));
  return frame('Inquiry form · static design',x,y,w,mobile?830:870,mobile?null:'#f2f6ee',a);
}

function desktop(){
  const a=[];
  a.push(image('Owned Arc’IT panorama · desktop hero',0,0,1440,800),box('Hero contrast layer',0,0,1440,800,'#10251bb0'));
  a.push(box('Restrained glass navigation',64,28,1312,68,'#fffaf114',14),title('Arc’IT AI',90,50,240,38,28,C.cream),link('How I help',872,52,116,C.cream,15),link('The walkthrough',1004,52,164,C.cream,15),button('Let’s talk ↗',1190,43,160,{light:true,small:true}));
  a.push(mark(675,155,90),label('PRACTICAL AI / DONE FOR YOU',410,274,620,C.cream,'center',12));
  a.push(title('You’ve got it working.\nLet’s take it further.',210,317,1020,147,62,C.cream,'center'));
  a.push(text('Hero explanation','I review what you’ve built, fix the weak spots and put a solid way of working around it — so your team can use it and keep improving it.',410,486,620,90,20,C.cream,'Geist',{textAlign:'center',lineHeight:1.42}));
  a.push(button('Talk about your setup ↗',475,604,242,{light:true}),text('Walkthrough action','Watch the walkthrough ↓',748,621,265,30,17,C.cream));
  a.push(label('Business first. Security built in.',450,739,540,C.cream,'center',13));
  a.push(label('THE WALKTHROUGH',440,875,560,C.muted,'center'),title('A working demo is a good start.',190,918,1060,62,43,C.ink,'center'));
  a.push(text('Walkthrough introduction','Maybe you built it with AI. Maybe a developer handed it over. I’m Gustav. I’ll help you understand what’s there, what needs attention and what it takes to use it day to day.',345,994,750,82,18,C.muted,'Geist',{textAlign:'center',lineHeight:1.45}));
  a.push(video(240,1112,960,460));
  a.push(box('Section rule',120,1652,1200,1,C.rule),label('HOW I CAN HELP',120,1714,400),title('Start with what you have.',120,1754,1120,62,44),text('Offer introduction','A question, a first version or a setup your team already relies on.',120,1830,1000,38,19,C.muted));
  offers.forEach((o,i)=>{
    const x=120+i*416;
    a.push(motif(i,x+46,1918),box(`Offer ${i+1} rule`,x,2075,368,1,C.rule),label(o.eyebrow,x,2102,370),text(o.heading,o.heading,x,2145,373,45,27,C.ink,'Geist',{fontWeight:500}),text(`Offer ${i+1} explanation`,o.body,x,2210,365,153,17.5,C.muted,'Geist',{lineHeight:1.45}),link(o.cta,x,2383,375));
    if(i===2)a.push(link('See an example setup ↗',x,2422,375,C.green,14),label('Optional template concept · Sample data',x,2454,375,C.muted,'left',9));
  });
  a.push(text('Delivery responsibility','For implementation work, I take care of the agreed setup and ongoing work. You stay involved where business knowledge or approvals need you.',120,2502,1200,63,17,C.muted));
  a.push(box('Inquiry surface',0,2620,1440,1230,C.pale),label('LET’S TALK',120,2696,500),title('Show me what\nyou’ve got.',120,2739,590,126,49),text('Inquiry introduction','Tell me what it does, who uses it and where you’re unsure. We’ll work out whether I can help and what a useful first step looks like.',120,2888,535,110,18,C.muted,'Geist',{lineHeight:1.45}));
  a.push(inquiryForm(750,2700,570));
  [3040,3230,3470,3655].forEach((y,i)=>a.push(box(`FAQ ${i+1} rule`,120,y-16,535,1,'#b5c6b7'),text(faqs[i][0],faqs[i][0],120,y,535,30,20,C.ink,'Geist',{fontWeight:500}),text(`FAQ ${i+1} answer`,faqs[i][1],120,y+43,535,i===1?171:133,16,C.muted,'Geist',{lineHeight:1.42})));
  a.push(image('Owned Arc’IT panorama · footer',0,3850,1440,460),box('Footer contrast layer',0,3850,1440,460,'#10251bdb'));
  a.push(title('Business first.\nSecurity built in.',300,3916,840,130,49,C.cream,'center'));
  a.push(link('Email ↗',480,4124,130,C.cream),link('onlinesourdough ↗',638,4124,220,C.cream),link('GitHub ↗',902,4124,130,C.cream),label('Arc’IT AI · Practical help with AI and software.',330,4230,780,C.sage,'center',11));
  return frame('01 · Desktop · 1440 · Practical delivery',0,0,1440,4310,C.paper,a);
}

function mobile(){
  const a=[];
  a.push(title('Arc’IT AI',24,29,216,34,26),button('Let’s talk ↗',259,25,107,{small:true}));
  a.push(mark(159,127,72,C.green),label('PRACTICAL AI / DONE FOR YOU',24,224,342,C.green,'center',10));
  a.push(title('You’ve got it\nworking.\nLet’s take it\nfurther.',24,270,342,173,39,C.ink,'center'));
  a.push(text('Hero explanation','I review what you’ve built, fix the weak spots and put a solid way of working around it — so your team can use it and keep improving it.',30,475,330,133,17,C.muted,'Geist',{textAlign:'center',lineHeight:1.43}));
  a.push(button('Talk about your setup ↗',24,641,342),text('Walkthrough action','Watch the walkthrough ↓',24,718,342,30,16,C.green,'Geist',{textAlign:'center'}),label('Business first. Security built in.',24,781,342,C.muted,'center',10));
  a.push(image('Owned panorama · mobile strip',0,837,390,242));
  a.push(label('THE WALKTHROUGH',24,1133,342),title('A working demo\nis a good start.',24,1175,342,86,32),text('Walkthrough introduction','Maybe you built it with AI. Maybe a developer handed it over. I’m Gustav. I’ll help you understand what’s there, what needs attention and what it takes to use it day to day.',24,1290,342,154,17,C.muted,'Geist',{lineHeight:1.43}),video(24,1477,342,272,true));
  a.push(box('Section rule',24,1820,342,1,C.rule),label('HOW I CAN HELP',24,1870,342),title('Start with\nwhat you have.',24,1910,342,86,34),text('Offer introduction','A question, a first version or a setup your team already relies on.',24,2015,342,82,17,C.muted));
  offers.forEach((o,i)=>{
    const y=2160+i*505;
    a.push(motif(i,66,y),box(`Offer ${i+1} rule`,24,y+153,342,1,C.rule),label(o.eyebrow,24,y+181,342),text(o.heading,o.heading,24,y+225,342,42,26,C.ink,'Geist',{fontWeight:500}),text(`Offer ${i+1} explanation`,o.body,24,y+286,342,143,17,C.muted,'Geist',{lineHeight:1.44}),link(o.cta,24,y+443,342));
    if(i===2)a.push(link('See an example setup ↗',24,y+486,342,C.green,14),label('Optional template concept · Sample data',24,y+521,342,C.muted,'left',9));
  });
  a.push(text('Delivery responsibility','For implementation work, I take care of the agreed setup and ongoing work. You stay involved where business knowledge or approvals need you.',24,3785,342,132,17,C.muted));
  a.push(box('Inquiry surface',0,3970,390,2370,C.pale),label('LET’S TALK',24,4024,342),title('Show me what\nyou’ve got.',24,4068,342,93,36),text('Inquiry introduction','Tell me what it does, who uses it and where you’re unsure. We’ll work out whether I can help and what a useful first step looks like.',24,4192,342,143,17,C.muted,'Geist',{lineHeight:1.44}));
  a.push(inquiryForm(24,4400,342,true));
  [5340,5575,5870,6113].forEach((y,i)=>a.push(box(`FAQ ${i+1} rule`,24,y-22,342,1,'#b5c6b7'),text(faqs[i][0],faqs[i][0],24,y,342,56,20,C.ink,'Geist',{fontWeight:500}),text(`FAQ ${i+1} answer`,faqs[i][1],24,y+66,342,i===1?211:153,16,C.muted,'Geist',{lineHeight:1.43})));
  a.push(image('Owned panorama · mobile footer',0,6375,390,430),box('Footer contrast layer',0,6375,390,430,'#10251bdb'));
  a.push(title('Business first.\nSecurity built in.',24,6446,342,96,33,C.cream,'center'),link('Email ↗',51,6615,80,C.cream,15),link('onlinesourdough ↗',157,6615,205,C.cream,15),text('GitHub ↗','GitHub ↗',24,6672,342,28,15,C.cream,'Geist',{textAlign:'center'}),text('Footer credit','Arc’IT AI · Practical help with\nAI and software.',24,6740,342,40,11,C.sage,'Geist Mono',{textAlign:'center'}));
  // Bring the scenery into the first mobile viewport without shrinking prose.
  const heroY=new Map([[127,100],[224,193],[270,232],[475,432],[641,581],[718,652],[781,705],[837,752]]);
  a.forEach(n=>{if(heroY.has(n.y))n.y=heroY.get(n.y);else if(n.y>=1079)n.y-=85;});
  return frame('02 · Mobile · 390 · Content before scenery',1600,0,390,6720,C.paper,a);
}
function notes(){
  const a=[label('ARC’IT AI / DRAFT 03 / 21 SEPTEMBER 2026',56,44,890,C.green),title('The method is behind\nthe work, not the headline.',56,93,878,130,42),text('Intent','A saved design for practical, done-for-you help. The original Arc’IT identity, with Kastanje’s scenic hero rhythm and Agentic Engineer’s abstract offer graphics.',56,262,830,106,22,C.muted)];
  const sections=[
    ['01 / WHAT CHANGED','Wordmark-only navigation. The real Cut Six mark is centred in the hero. No mascot. Three practical offers. No software/defense loop section. External footer links only.'],
    ['02 / MOTION, NOT ANIMATED HERE','Points gather slowly; rings find alignment; one accent advances through the strokes. Use 6–9 second cycles, minimal travel and no flashing. Stop offscreen, in a hidden tab and with reduced motion. Keep a complete static state.'],
    ['03 / EXISTING TOOLS, NOT A NEW PLATFORM','Instructions, skills, tests and review around Codex, Cursor or another suitable harness. Agent permissions require enforced controls; instructions alone are not a security boundary. Human decisions remain at release and other agreed gates.'],
    ['04 / LINKS & PLACEHOLDERS','Primary actions → inquiry. Walkthrough → VSL section. Film unrecorded; form is a static design and sends nothing. Optional example → the preserved sample-data dashboard, not a customer installation or a published product.'],
    ['05 / ORIGINAL ASSETS & TYPOGRAPHY','Owned Arc’IT panorama and exact Cut Six geometry. Geist Pixel headings, Geist body, Geist Mono labels. Import the included TTF fonts through Agents & MCP → Fonts when opening on a fresh browser origin.'],
    ['06 / REVIEW & IMPLEMENTATION BOUNDARY','Desktop 1440 and mobile 390 are editable compositions, not a responsive implementation. Reconcile the form with the existing Worker before coding. Keep the current production site and previous drafts unchanged.']
  ];
  sections.forEach(([h,b],i)=>{const y=415+i*197;a.push(box(`Note ${i+1} rule`,56,y-16,888,1,C.rule),label(h,56,y,870,C.green),text(h+' body',b,56,y+42,870,136,18,C.ink,'Geist',{lineHeight:1.43}));});
  a.push(label('EXTERNAL FOOTER LINKS',56,1640,870,C.green),text('Footer destinations','mailto:hello@arcitai.com\nhttps://onlinesourdough.com/\nhttps://github.com/arcitai',56,1683,870,98,17,C.ink,'Geist Mono'));
  a.push(label('DURABLE SOURCES',56,1820,870,C.green),text('Source pointers','website-copy.md — full English editorial handoff\nDESIGN.md — canonical design direction\nGitHub arcitai/arcitai #6 — factory-method research\nREADME.md — fonts, saved document and native proof',56,1864,870,137,17,C.ink,'Geist Mono'));
  return frame('03 · Notes · Motion and implementation boundaries',2170,0,1000,2080,C.cream,a);
}
let req=0;
async function call(name,args={}){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++req,method:'tools/call',params:{name,arguments:args}})});
  if(!response.ok)throw new Error(`${name}: HTTP ${response.status}`);
  const json=await response.json();
  if(json.error||json.result?.isError)throw new Error(`${name}: ${JSON.stringify(json.error??json.result)}`);
  const s=json.result?.content?.find(c=>c.type==='text')?.text;
  try{return JSON.parse(s);}catch{return {text:s};}
}
const existing=await call('read_nodes',{depth:0});
if(existing.nodes?.length!==1||existing.nodes[0].name!=='Arc’IT AI · R3 · Editable landing draft') throw new Error('Expected the inspected private seed only; refusing to replace a different document.');
await call('delete_node',{nodeId:existing.nodes[0].id});
const boards=[desktop(),mobile(),notes()];
// OpenPencil lists frontmost siblings first, unlike HTML paint order.
function frontToBack(n){if(n.children){n.children.forEach(frontToBack);n.children.reverse();}return n;}
boards.forEach(frontToBack);
for(const data of boards)console.log('Inserted',data.name,await call('insert_node',{data,postProcess:false}));
const actual=await call('read_nodes',{depth:0});
for(const b of boards){const n=actual.nodes.find(n=>n.name===b.name);if(!n)throw new Error(`Missing board ${b.name}`);await call('update_node',{nodeId:n.id,data:{x:b.x,y:b.y}});}
console.log('Document',await call('get_document_info'));
// The seed uses legacy top-level children; v0.8.4 exposes a virtual Page 1
// but rejects RenamePage for that virtual page. Keep the named root boards.
console.log('Viewport',await call('set_viewport',{pan_x:'0',pan_y:'0',zoom_percent:'65'}));
