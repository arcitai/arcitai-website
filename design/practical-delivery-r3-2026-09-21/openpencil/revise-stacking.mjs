// One-time correction of the first native render; refuses an already-reversed board.
const endpoint='http://127.0.0.1:59404/mcp';
let request=0;
async function call(name,args){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:++request,method:'tools/call',params:{name,arguments:args}})});
  const j=await response.json();if(j.error||j.result?.isError)throw new Error(JSON.stringify(j.error??j.result));
  return JSON.parse(j.result.content.find(c=>c.type==='text').text);
}
const {nodes}=await call('read_nodes',{depth:-1});
if(nodes.length!==3||nodes[0].children?.[0]?.name!=='Owned Arc’IT panorama · desktop hero')throw new Error('Expected original R3 stacking only.');
function reverse(n){if(n.name==='Arc’IT AI · Practical help with\nAI and software.')n.height=40;if(n.children){n.children.forEach(reverse);n.children.reverse();}}
for(const n of nodes){reverse(n);console.log(n.name,await call('update_node',{nodeId:n.id,data:{children:n.children}}));}
