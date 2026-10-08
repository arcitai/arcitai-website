// Read-only checks for the bounded copy/navigation revision; not visual proof.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const file=path.join(dir,'arcitai-r3.2.op');
const doc=JSON.parse(fs.readFileSync(file,'utf8'));
const oldFile=path.join(dir,'arcitai-r3.1.op');
const old=JSON.parse(fs.readFileSync(oldFile,'utf8'));
const flat=roots=>{const a=[];const walk=n=>{a.push(n);(n.children??[]).forEach(walk);};roots.forEach(walk);return a;};
const all=flat(doc.children),before=flat(old.children),byId=new Map(all.map(n=>[n.id,n]));
assert.equal(hash(file),'8c4c518bacb764b03a9ad2f3116ee8541f5d1d889750782fd08465bc26669c06');
assert.equal(hash(oldFile),'9bf5788e235e5440d266bb5aa404ab0b9ca8d7a8955bfab5dc0f09338e220a5f');
assert.equal(all.length,381);assert.equal(byId.size,381);
assert.equal(all.filter(n=>n.type==='text').length,138);
assert.deepEqual(doc.images,old.images);
for(const n of before){
  const current=byId.get(n.id);assert.ok(current,`Missing ${n.id}`);
  const fields=['type','fill','fontFamily','fontSize','fontWeight','lineHeight','d'];
  if(!['n6','n7','n8','n168'].includes(n.id))fields.push('x','y','width','height');
  for(const field of fields)assert.deepEqual(current[field],n[field],`Unintended ${field} change: ${n.id}`);
}
const normal=s=>s.replace(/-\n/g,'-').replace(/\s+/g,' ').trim();
const copy=fs.readFileSync(path.join(dir,'../../../content/practical-delivery-r3-2026-09-21/website-copy.md'),'utf8');
for(const board of doc.children.slice(0,2)){
  const texts=flat([board]).filter(n=>n.type==='text');
  for(const phrase of ['From prototype to production-ready software.','Project inquiry.','AI consultation.','Code and security review.','Agent workflow setup.','Discuss a project ↗'])assert.ok(texts.some(n=>normal(n.content)===phrase),`Missing ${phrase}`);
  assert.ok(!texts.some(n=>/Show me what|How I help|The walkthrough|Let’s take it|Talk it through|Keep the work moving/i.test(n.content)));
  const nav=board.children.filter(n=>n.type==='text'&&n.y<72&&n.fontFamily==='Geist Mono').sort((a,b)=>a.x-b.x).map(n=>n.content);
  assert.deepEqual(nav,board.width===1440?['Offers ⌄','Process','Scope','Start']:['Offers ⌄','Start']);
  const front=board.children[0];
  assert.equal(front.content,board.width===1440?'Start':'Offers ⌄');
  for(const name of ['Inquiry introduction','Offer 1 explanation','Offer 3 explanation','Hero explanation','FAQ 2 answer'])assert.ok(copy.includes(board.children.find(n=>n.name===name).content),`Copy drift: ${name}`);
}
const designFile=path.join(dir,'../DESIGN.md');
assert.equal(doc.designMd.raw,fs.readFileSync(designFile,'utf8'));
console.log(JSON.stringify({result:'PASS — copy, navigation, unchanged layout/assets and source preservation',nodes:all.length,sourceSha256:hash(file),designSha256:hash(designFile),copySha256:hash(path.join(dir,'../../../content/practical-delivery-r3-2026-09-21/website-copy.md'))},null,2));
