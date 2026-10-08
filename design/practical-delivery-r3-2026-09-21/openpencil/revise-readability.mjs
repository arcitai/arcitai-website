// Bounded native review correction: mobile rhythm and small mono labels.
const endpoint='http://127.0.0.1:59404/mcp';let request=0;
async function call(name,args){const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++request,method:'tools/call',params:{name,arguments:args}})});const j=await r.json();if(j.error||j.result?.isError)throw new Error(JSON.stringify(j.error??j.result));return JSON.parse(j.result.content.find(c=>c.type==='text').text);}
const {nodes}=await call('read_nodes',{depth:-1});
const mobile=nodes.find(n=>n.name.startsWith('02 · Mobile'));
if(nodes.length!==3||mobile.height!==6805)throw new Error('Expected the inspected first R3 candidate.');
const heroY=new Map([[127,100],[224,193],[270,232],[475,432],[641,581],[718,652],[781,705],[837,752]]);
mobile.children.forEach(n=>{if(heroY.has(n.y))n.y=heroY.get(n.y);else if(n.y>=1079)n.y-=85;});mobile.height=6720;
function readable(n){if(n.type==='text'&&n.fontFamily==='Geist Mono'&&n.fontSize<11)n.fontSize=11;(n.children??[]).forEach(readable);}
for(const n of nodes){readable(n);console.log(n.name,await call('update_node',{nodeId:n.id,data:{height:n.height,children:n.children}}));}
