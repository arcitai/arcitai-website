// Read-only structural evidence. Native canvas inspection is separate.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const file=path.join(dir,'arcitai-r3.1.op');
assert.equal(hash(file),'9bf5788e235e5440d266bb5aa404ab0b9ca8d7a8955bfab5dc0f09338e220a5f');
assert.equal(hash(path.join(dir,'arcitai-r3.op')),'4e5194f8f9198e6462a5f58003ca43febf973ceb9addd06d47261b618d1198d3');
assert.equal(hash(path.join(dir,'seed.op')),'d956e8497282a564dbe0cd672890f0975aae6fd7b9e419fd3644bab2c1be983f');
const doc=JSON.parse(fs.readFileSync(file,'utf8'));
assert.deepEqual(doc.children.map(n=>[n.width,n.height]),[[1440,4342],[390,6784],[1000,2500]]);
const nodes=[];
function walk(n) {
  nodes.push(n);
  for(const child of n.children??[]) {
    assert.ok(child.x>=0&&child.y>=0,`Negative position: ${child.name}`);
    assert.ok(child.x+child.width<=n.width+1,`Horizontal overflow: ${child.name}`);
    assert.ok(child.y+child.height<=n.height+1,`Vertical overflow: ${child.name}`);
    walk(child);
  }
}
doc.children.forEach(walk);
assert.equal(nodes.length,379);
assert.equal(new Set(nodes.map(n=>n.id)).size,379);
const texts=nodes.filter(n=>n.type==='text');
assert.equal(texts.length,136);
assert.ok(texts.every(n=>n.fontSize>=11));
assert.equal(Object.keys(doc.images).length,1);
const marks=nodes.filter(n=>/^Cut Six \d/.test(n.name));
assert.equal(marks.length,36);
assert.ok(marks.every(n=>['#000000','#FFFFFF'].includes(n.fill[0].color)));
assert.equal(marks.filter(n=>n.fill[0].color==='#000000').length,12);
assert.equal(marks.filter(n=>n.fill[0].color==='#FFFFFF').length,24);
const copy=fs.readFileSync(path.join(dir,'../../../content/practical-delivery-r3-2026-09-21/website-copy.md'),'utf8');
const edited=['Hero explanation','Walkthrough introduction','Offer 2 explanation','Offer 3 explanation','FAQ 2 answer','FAQ 4 answer'];
for(const board of doc.children.slice(0,2)) {
  const header=board.children.find(n=>n.name==='Opaque full-width navigation');
  assert.equal(header.x,0); assert.equal(header.y,0); assert.equal(header.width,board.width);
  assert.equal(header.height,board.width===1440?72:62);
  assert.equal(header.fill[0].color,'#f8f2e8');
  for(const name of edited) {
    const text=board.children.find(n=>n.name===name);
    assert.ok(text&&copy.includes(text.content),`Copy drift: ${name}`);
  }
  const strings=board.children.filter(n=>n.type==='text').map(n=>n.content);
  assert.ok(strings.some(t=>t.includes('production-ready')));
  assert.ok(strings.some(t=>t.includes('software factory')&&t.includes('defense factory')));
  assert.ok(!strings.some(t=>/Two systems|One delivery process|Useful AI, with someone/i.test(t)));
  assert.ok(!board.children.some(n=>/glass/i.test(n.name)));
}
const design=fs.readFileSync(path.join(dir,'../DESIGN.md'),'utf8');
assert.equal(doc.designMd.raw,design);
console.log(JSON.stringify({result:'PASS — structural and copy consistency only',nodes:nodes.length,textNodes:texts.length,monochromeLogoPieces:marks.length,sourceSha256:hash(file),designSha256:hash(path.join(dir,'../DESIGN.md')),copySha256:hash(path.join(dir,'../../../content/practical-delivery-r3-2026-09-21/website-copy.md'))},null,2));
