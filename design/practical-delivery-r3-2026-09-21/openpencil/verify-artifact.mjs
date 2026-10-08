// Read-only structural checks, not a substitute for native visual review.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const source=path.join(dir,'arcitai-r3.op');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const doc=JSON.parse(fs.readFileSync(source,'utf8'));
assert.equal(hash(source),'4e5194f8f9198e6462a5f58003ca43febf973ceb9addd06d47261b618d1198d3');
assert.equal(hash(path.join(dir,'seed.op')),'d956e8497282a564dbe0cd672890f0975aae6fd7b9e419fd3644bab2c1be983f');
assert.equal(doc.children.length,3);
assert.deepEqual(doc.children.map(n=>[n.width,n.height]),[[1440,4310],[390,6720],[1000,2080]]);
const all=[];
const walk=n=>{all.push(n);(n.children??[]).forEach(c=>{assert.ok(c.x>=0&&c.y>=0,`Negative position: ${c.name}`);assert.ok(c.x+c.width<=n.width+1,`Horizontal overflow: ${c.name}`);assert.ok(c.y+c.height<=n.height+1,`Vertical overflow: ${c.name}`);walk(c);});};
doc.children.forEach(walk);
assert.equal(all.length,350);
assert.equal(new Set(all.map(n=>n.id)).size,350);
const texts=all.filter(n=>n.type==='text');
assert.equal(texts.length,132);
assert.ok(texts.every(n=>n.fontSize>=11));
assert.equal(Object.keys(doc.images??{}).length,1);
for(const board of doc.children.slice(0,2)){
  const textNodes=[];const gather=n=>{if(n.type==='text')textNodes.push(n.content);(n.children??[]).forEach(gather);};gather(board);
  for(const required of ['Talk it through.','Review and improve it.','Keep the work moving.','See an example setup ↗','Instructions alone don’t enforce permissions','Please don’t include credentials'])assert.ok(textNodes.some(t=>t.includes(required)),`Missing ${required}`);
  assert.ok(!textNodes.some(t=>/Two systems|One delivery process|Useful AI, with someone|Prototype to Production|AI Agent Factories/i.test(t)));
}
const lum=hex=>{const rgb=hex.match(/[\da-f]{2}/gi).map(s=>parseInt(s,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
const contrast=(a,b)=>{const vals=[lum(a),lum(b)].sort((a,b)=>b-a);return (vals[0]+.05)/(vals[1]+.05);};
const contrasts=[['Ink / paper','18211d','f8f2e8'],['Muted / paper','615f56','f8f2e8'],['Action / cream','236b59','fffaf1'],['Muted / inquiry','615f56','e6eee5']].map(([name,a,b])=>({name,ratio:Number(contrast(a,b).toFixed(2))}));
assert.ok(contrasts.every(x=>x.ratio>=4.5));
console.log(JSON.stringify({result:'PASS — structural draft checks only',nodes:all.length,textNodes:texts.length,embeddedImages:1,sourceSha256:hash(source),contrasts},null,2));
