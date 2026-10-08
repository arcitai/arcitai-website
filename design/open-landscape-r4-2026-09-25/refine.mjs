import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const candidate = fileURLToPath(new URL('./arcitai-open-landscape-r4-reviewed.op', import.meta.url));
assert.ok(!fs.existsSync(candidate), 'Keep prior candidates; output must be absent');
let id = 0;
async function call(name, args = {}) {
  const response = await fetch('http://127.0.0.1:60865/mcp', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({jsonrpc: '2.0', id: ++id, method: 'tools/call', params: {name, arguments: args}}),
  });
  assert.ok(response.ok, `${name}: ${response.status}`);
  const result = await response.json();
  assert.ok(!result.error && !result.result?.isError, JSON.stringify(result));
  const value = result.result.content.find(item => item.type === 'text')?.text;
  try { return JSON.parse(value); } catch { return {text: value}; }
}
const {nodes} = await call('read_nodes', {depth: -1});
assert.equal(nodes.length, 4);
const desktop = nodes.find(n => n.name === '01 — Desktop / Open landscape');
const mobile = nodes.find(n => n.name === '03 — Mobile / 390');
assert.ok(desktop && mobile);
const note = desktop.children.find(n => n.content?.startsWith('Project inquiry continues'));
if (note) await call('delete_node', {nodeId: note.id});
await call('update_node', {nodeId: desktop.id, data: {height: 3698}});
const baseline = JSON.parse(fs.readFileSync(new URL('./arcitai-open-landscape-r4.op', import.meta.url), 'utf8'));
const originalMobile = baseline.children.find(n => n.name === mobile.name);
assert.ok(originalMobile);
// Keep the original guide length; fit only motif artwork designed on a 560px canvas.
for (const motif of mobile.children.filter(n => /still state of existing animation/.test(n.name))) {
  const scale = 342 / 560;
  const original = originalMobile.children.find(n => n.name === motif.name);
  for (const child of motif.children) {
    if (child.name === 'Shared guide') continue;
    const source = original.children.find(n => n.name === child.name);
    assert.ok(source);
    await call('update_node', {nodeId: child.id, data: {x: Math.round(source.x * scale), width: Math.round(source.width * scale)}});
  }
}
const reviewed = await call('read_nodes', {depth: -1});
let count = 0;
function visit(node) { count++; node.children?.forEach(visit); }
reviewed.nodes.forEach(visit);
assert.equal(count, 289);
const patchedMobile = reviewed.nodes.find(n => n.id === mobile.id);
for (const motif of patchedMobile.children.filter(n => /still state of existing animation/.test(n.name))) {
  assert.ok(motif.children.every(n => n.x >= 0 && n.x + n.width <= motif.width), `Overflow in ${motif.name}`);
}
await call('save_document', {filePath: candidate});
console.log(JSON.stringify({candidate, count, changes: ['Remove internal note from page board', 'Fit mobile motif artwork within its frame']}));
