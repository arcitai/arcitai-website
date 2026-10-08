import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const dir = path.dirname(fileURLToPath(import.meta.url));
const endpoint = 'http://127.0.0.1:60865/mcp';
const C = {paper:'#f8f2e8',ink:'#18211d',muted:'#615f56',green:'#236b59',sage:'#e5ede2',line:'#d8d9cf',white:'#ffffff',warm:'#eee3d1'};
const day = `data:image/jpeg;base64,${fs.readFileSync(path.resolve(dir,'../../public/assets/arcitai-day-poster-v6.jpg')).toString('base64')}`;
let nodeCount=0,request=0;
const fill=c=>[{type:'solid',color:c}];
const node=(type,name,x,y,width,height,more={})=>({id:`journey-${++nodeCount}`,type,name,x:Math.round(x),y:Math.round(y),width:Math.round(width),height:Math.round(height),...more});
const rect=(name,x,y,w,h,c,r=0)=>node('rectangle',name,x,y,w,h,{fill:fill(c),cornerRadius:r});
const frame=(name,x,y,w,h,c,children=[],r=0)=>node('frame',name,x,y,w,h,{layout:'none',clipContent:true,fill:c?fill(c):[],cornerRadius:r,children});
const text=(content,x,y,w,h,size=21,color=C.ink,more={})=>node('text',content.split('\n')[0],x,y,w,h,{content,fontFamily:'Geist',fontSize:size,fontWeight:400,lineHeight:1.38,textGrowth:'fixed-width-height',fill:fill(color),...more});
const head=(s,x,y,w,h,size=46)=>text(s,x,y,w,h,size,C.ink,{fontWeight:500,lineHeight:1.08,letterSpacing:-1});
const pixel=(s,x,y,w,h,size=28)=>text(s,x,y,w,h,size,C.ink,{fontFamily:'Geist Pixel',lineHeight:1.12});
const label=(s,x,y,w,h=28)=>text(s,x,y,w,h,16,C.green,{fontWeight:500});
const line=(name,x,y,w)=>rect(name,x,y,w,1,C.line);
function arrow(x,y,w=44,color=C.green){return node('path','Connection',x,y,w,14,{d:`M0 7H${w-1}M${w-8} 0L${w-1} 7L${w-8} 14`,fill:[],stroke:{fill:fill(color),thickness:2}});}
function down(x,y,h=64){return node('path','Connection down',x,y,14,h,{d:`M7 0V${h-1}M0 ${h-8}L7 ${h-1}L14 ${h-8}`,fill:[],stroke:{fill:fill(C.green),thickness:2}});}
function card(name,caption,body,x,y,w=426,h=190,color=C.white){return frame(name,x,y,w,h,color,[label(caption,24,22,w-48),head(name,24,62,w-48,72,30),text(body,24,140,w-48,h-148,19,C.muted)],14);}
function mapHeader(kicker,title,desc){return [label(kicker,64,42,1460),head(title,64,92,1460,116,52),text(desc,64,215,1430,66,23,C.muted)];}
function ownMap(){const a=mapHeader('ANBEFALET RETNING · TIL GUSTAVS VURDERING','Én forretning. To forskellige købsbehov.','Læring og leverance deler metode og afsender. Kunden behøver ikke gå gennem alle domæner.');
  a.push(card('Gustav Online','PERSON + INDHOLD','YouTube · LinkedIn · Instagram\nTillid, erfaringer og frivillig mail.',64,340,370,230),arrow(447,447,42),card('Online Sourdough','METODEN + MENUEN','Founders og business leaders.\nPraktisk AI på tværs af forretningen.',506,340,492,230,C.sage),arrow(1012,447,42),card('DIY / DWY','JEG VIL SELV KUNNE','Resources: arbejd selv.\nThe Fermentary: få hjælp undervejs.',1072,340,464,230));
  a.push(down(744,584,112),text('Complete Bake\nDone for you by Arc’IT AI',778,608,370,70,19,C.green));
  a.push(card('Virksomhed / team','JEG VIL HAVE DET LØST','Direkte fra indhold, en anbefaling\neller et konkret behov.',64,718,370,230),arrow(447,825,42),card('Arc’IT AI','UDFØRELSE + AFTALT ANSVAR','Kort walkthrough. Ingen email-gate.\nKunden køber en leverance.',506,718,492,230,C.sage),arrow(1012,825,42),card('Projektforespørgsel','NÆSTE TRIN','Afklar opgave, budget, data, drift\nog hvem der tager ansvar.',1072,718,464,230));
  a.push(line('Decision rule',64,1008,1472),head('Hvorfor ikke bare ét site?',64,1050,650,55,34),text('Det kunne fungere. Men to forskellige købsbehov taler for en selvstændig leveranceside.\nBehold Arc’IT kort og tydeligt forbundet med Online Sourdough — ikke som endnu et univers.',64,1122,1430,80,23,C.muted));
  return frame('01 — Gustav · anbefalet kunderejse',0,0,1600,1260,C.paper,a);
}
function frederik(){const a=mapHeader('REFERENCE · OBSERVERET 25.09.2026','Frederik: flere indgange, en fælles menu.','Den korte walkthrough er ét spor. Nyhedsbrevet og 1:1-ventelisten er andre.');
  const row=(y,l,m,r)=>a.push(card(...l,64,y,440,206),arrow(516,y+100,34),card(...m,566,y,460,206,C.sage),arrow(1040,y+100,34),card(...r,1090,y,446,206));
  row(320,['/model/','EMAIL-INDGANG','Video + løbende mails.'],['/walkthrough/','FAKTISK TESTET REDIRECT','Efter tilmelding med Gustavs email.'],['Menu card','OBSERVERET LINK','Videoens primære næste handling.']);
  row(566,['/ · Newsletter','SEPARAT EMAIL-INDGANG','Testen stoppede ved CAPTCHA.'],['/thank-you/','KONFIGURERET · IKKE TESTET','Beder om bekræftelse på mail.'],['Menu card','OBSERVERET LINK PÅ TAKKESIDEN','Samme tilbudsoversigt.']);
  row(812,['frederikpahuus.com','PERSONLIGT ARKIV','Posts + subscribe + Links.'],['/waitlist/','OBSERVERET LINK FRA PROFIL','Specifik kø til 1:1-mentorship.'],['Mail / dialog','IKKE VERIFICERET','Ingen adgang til indbakke/sekvenser.']);
  a.push(line('Menu outcomes',64,1074,1472),head('Menuen forgrener sig.',64,1114,650,50,34),text('AI-værktøj → login. Mentorship / Inner Circle / dag med Fred → tilbudsdokumenter.\nWorkshop, DFY og event har kapacitets- eller aktualitetsforbehold. Ikke én universel checkout.',64,1184,1440,86,22,C.muted));
  return frame('02 — Frederik · observeret og ukendt',1750,0,1600,1330,C.paper,a);
}
function owain(){const a=mapHeader('REFERENCE · FORRETNINGSMODEL','Owain: lær selv, få hjælp, eller køb levering.','En tættere parallel til din forretning. Men hans uddannelse er mere udviklerorienteret.');
  a.push(frame('Personal entry',64,320,1472,150,C.sage,[head('Owain Lewis',28,25,510,44,34),text('Personligt site, YouTube og newsletter. Offentlig erfaring fra eget arbejde.',28,86,1400,42,22,C.muted)],14));
  [280,787,1294].forEach(x=>a.push(down(x,486,64)));
  a.push(card('AI Engineer','DIY + GRUPPESTØTTE','Kurser, community og live Q&A.\nBesøgende ejer selv deres build.\nNæste trin: Skool-medlemskab.',64,572,456,298),card('BuildTogether','DWY / LIVE CHALLENGE','Aktuel side: gruppeforløb.\nByg selv med hjælp undervejs.\nNæste trin: venteliste.',572,572,456,298),card('GradientWork','DFY / VIRKSOMHEDER','Owain tager leveranceansvaret.\nSoftware til virksomhedens arbejde.\nAktuel side: fuldt booket.',1080,572,456,298));
  a.push(line('Interpretation',64,928,1472),head('Det, vi tager med.',64,970,700,52,34),text('Ansvarsforskellen — ikke alle domænerne, “100x”-løftet eller hans målgruppe.\nFor dig: Online Sourdough samler DIY + DWY; Arc’IT står for DFY.\nPilene viser roller, ikke en verificeret obligatorisk kliksekvens.',64,1038,1440,118,23,C.muted));
  return frame('03 — Owain · roller og destinationer',3500,0,1600,1210,C.paper,a);
}
function mark(x,y,size){const s=size/60;const polys=[[[26,2],[40,2],[34,16],[20,16]],[[19,18],[33,18],[27,32],[13,32]],[[12,34],[26,34],[20,48],[6,48]],[[42,2],[56,2],[56,16],[42,16]],[[36,18],[50,18],[50,32],[36,32]],[[48,34],[62,34],[62,48],[48,48]]];return frame('Original monochrome Cut Six',x,y,size,size,null,polys.map((p,i)=>{const minX=Math.min(...p.map(v=>v[0])),minY=Math.min(...p.map(v=>v[1]));return node('path',`Cut Six piece ${i+1}`,(minX-4)*s,(minY+4)*s,(Math.max(...p.map(v=>v[0]))-minX)*s,14*s,{d:p.map(([px,py],j)=>`${j?'L':'M'}${(px-minX)*s} ${(py-minY)*s}`).join(' ')+'Z',fill:fill(C.white)});}));}
function button(s,x,y,w=252){return frame(s,x,y,w,56,C.ink,[text(s,16,16,w-32,30,17,C.paper,{fontWeight:500,textAlign:'center'})],28);}
function photo(x,y,w,h){return node('rectangle','Proposed founder-video cover · still scene, not recorded VSL',x,y,w,h,{fill:[{type:'image',url:day,mode:'fill'}],cornerRadius:18});}
function motif(kind,x,y,w){const a=[line('Animation guide',0,40,w)];if(kind==='focus'){for(let i=0;i<7;i++)a.push(rect('Focus particle',i*(w-12)/7+4,18+(i%3)*14,6,6,i===3?C.green:'#8ea996'));a.push(rect('Focus axis',w/2,6,2,64,C.green));}else{for(let i=0;i<9;i++)a.push(rect('Review tile',i*(w-24)/9,18,20,40,i===4?C.green:'#d7e2d3',3));}return frame(`${kind} · static animation state`,x,y,w,82,null,a);}
function pipe(x,y,w){const a=[node('path','Continuous open pipe',0,12,w,42,{d:`M0 0C${w*.25} 0 ${w*.25} 4 ${w*.5} 4S${w*.75} 0 ${w} 0M0 42C${w*.25} 42 ${w*.25} 38 ${w*.5} 38S${w*.75} 42 ${w} 42`,fill:[],stroke:{fill:fill('#93ad98'),thickness:2}})];for(let i=0;i<19;i++)a.push(rect('Incoming flow square',i*(w-12)/19+4,24+(i%3)*7,5,5,C.green));return frame('Accepted pipe · static open state',x,y,w,70,null,a);}
function desktop(){const a=[pixel('Arc’IT AI',80,34,280,42,30),text('All offers ↗',1002,40,130,28,16,C.ink),text('☾',1172,33,34,40,25),line('Header rule',80,100,1120)];
  a.push(head('AI and software,',170,158,940,74,58),head('done for your team.',170,227,940,74,58));
  a[a.length-1].textAlign='center';a[a.length-2].textAlign='center';
  a.push(text('From a promising demo to software your team can use. I review what you\nhave, handle the agreed work, and set up the agents and checks around it.',210,332,860,74,20,C.muted,{textAlign:'center'}),photo(200,448,880,495),mark(550,574,180),frame('Proposed walkthrough play control',506,807,268,56,C.paper,[text('▶   Watch the walkthrough',15,17,238,28,16,C.ink,{textAlign:'center',fontWeight:500})],28),button('Discuss your project ↗',506,986,268));
  a.push(line('Scope rule',200,1110,880),motif('focus',216,1164,352),motif('review',708,1164,352),head('One-off AI consultation',200,1270,410,38,27),text('Work through a question or a blocker\nand decide what is worth doing next.',200,1328,420,72,18,C.muted),head('Software review & delivery',690,1270,410,38,27),text('Review a demo, MVP or existing system.\nThen take care of the agreed work.',690,1328,420,72,18,C.muted));
  a.push(line('Factory rule',200,1448,880),head('AI agent factory setup',200,1494,880,46,30),text('Agents for development, with a defence workflow around your software.\nI set up the access, instructions and checks, with local AI where it fits.',200,1558,880,70,19,C.muted),pipe(200,1662,880),line('Footer rule',80,1794,1120),text('Done for you by Gustav.',80,1832,500,32,16,C.muted),text('onlinesourdough ↗',1000,1832,220,32,16,C.ink));
  return frame('04 — Arc’IT · proposed walkthrough page (VSL not recorded)',0,1480,1280,1900,C.paper,a);
}
function mobile(){const a=[pixel('Arc’IT AI',24,26,208,36,26),text('All offers ↗',255,32,112,30,15),line('Header rule',24,87,342),head('AI and software,\ndone for your\nteam.',24,135,342,128,36),text('From a promising demo to software your\nteam can use. I review what you have,\nhandle the agreed work, and set up the\nagents and checks around it.',24,305,342,126,17,C.muted),photo(24,474,342,192),mark(151,502,88),frame('Visible touch play control',78,601,234,44,C.paper,[text('▶   Watch the walkthrough',10,12,214,26,15,C.ink,{textAlign:'center'})],22),button('Discuss your project ↗',24,705,342),line('Scope rule',24,817,342),motif('focus',24,857,342),head('One-off AI consultation',24,968,342,42,27),text('Work through a question or a blocker\nand decide what is worth doing next.',24,1022,342,66,17,C.muted),motif('review',24,1140,342),head('Software review\n& delivery',24,1252,342,74,29),text('Review a demo, MVP or existing system.\nThen take care of the agreed work.',24,1356,342,66,17,C.muted),line('Factory rule',24,1476,342),head('AI agent factory setup',24,1518,342,76,29),text('Agents for development, with a defence\nworkflow around your software.\nI set up the access, instructions and\nchecks, with local AI where it fits.',24,1598,342,132,17,C.muted),pipe(24,1752,342),line('Footer rule',24,1874,342),text('Done for you by Gustav.',24,1912,342,28,16,C.muted),text('onlinesourdough ↗',24,1958,342,28,16)];
  return frame('05 — Arc’IT · mobile 390 · proposed page',1430,1480,390,2030,C.paper,a);
}
async function call(name,args={}){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++request,method:'tools/call',params:{name,arguments:args}})});assert.ok(response.ok,`${name}: HTTP ${response.status}`);const r=await response.json();assert.ok(!r.error&&!r.result?.isError,JSON.stringify(r));const str=r.result?.content?.find(c=>c.type==='text')?.text;try{return JSON.parse(str);}catch{return {text:str};}}
const candidate=path.join(dir,'customer-journey-owner-review.op');
assert.ok(!fs.existsSync(candidate),'Refusing to overwrite an existing candidate');
const old=await call('read_nodes',{depth:0});
assert.equal(old.nodes.length,4,'Expected the preserved R4 editor state');
assert.equal(old.nodes[0].name,'01 — Desktop / Open landscape');
await call('save_document',{filePath:path.join(dir,'previous-editor-preserved.op')});
const boards=[ownMap(),frederik(),owain(),desktop(),mobile()];
function reversePaint(n){if(n.children){n.children.forEach(reversePaint);n.children.reverse();}}
boards.forEach(reversePaint);
for(const n of old.nodes)await call('delete_node',{nodeId:n.id});
for(const data of boards)await call('insert_node',{data,postProcess:false});
const live=await call('read_nodes',{depth:0});
for(const b of boards){const n=live.nodes.find(n=>n.name===b.name);assert.ok(n);await call('update_node',{nodeId:n.id,data:{x:b.x,y:b.y}});}
await call('set_design_md',{markdown:fs.readFileSync(path.join(dir,'DESIGN.md'),'utf8')});
await call('save_document',{filePath:candidate});
console.log(JSON.stringify({candidate,nodes:nodeCount,boards:boards.map(b=>b.name)}));
