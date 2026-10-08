import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const candidate = path.join(dir, 'brand-family-final-owner-review.op');
let sequence = 0;
async function call(name, args = {}) {
  const response = await fetch('http://127.0.0.1:60865/mcp', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++sequence, method: 'tools/call',
      params: { name, arguments: args } }),
  });
  assert.ok(response.ok);
  const result = await response.json();
  assert.ok(!result.error && !result.result?.isError, JSON.stringify(result));
  const value = result.result.content.find(item => item.type === 'text').text;
  try { return JSON.parse(value); } catch { return { text: value }; }
}
const flatten = roots => roots.flatMap(node => [node, ...flatten(node.children ?? [])]);
assert.ok(!fs.existsSync(candidate), 'Refusing to overwrite final candidate');
const before = (await call('read_nodes', { depth: -1 })).nodes;
assert.equal(flatten(before).length, 701);
const newsletters = before.find(node => node.name.startsWith('07 —'));
const personal = newsletters.children.find(node => node.name === 'gustavonline · newsletter');
assert.ok(personal);
// Reserve space for the honest empty-state caption rather than clipping it.
await call('update_node', { nodeId: personal.id, data: { height: 1128 } });
const mobile = before.find(node => node.name.startsWith('08 —'));
for (const preview of mobile.children.filter(node => node.type === 'frame' && node.width === 390)) {
  const heading = preview.children.find(node => node.content === preview.name.split(' ·')[0]);
  assert.ok(heading);
  await call('update_node', { nodeId: heading.id, data: { width: 145 } });
  const offers = preview.children.find(node => node.content === 'Offers ⌄');
  if (offers) await call('update_node', { nodeId: offers.id, data: { x: 186, width: 62 } });
  const newsletter = preview.children.find(node => node.content === 'Newsletter');
  await call('update_node', { nodeId: newsletter.id, data: { x: 258, width: 78 } });
  const theme = preview.children.find(node => node.name === 'Shared moon · light-theme state');
  await call('update_node', { nodeId: theme.id, data: { x: 347 } });
}
await call('set_design_md', { markdown: fs.readFileSync(path.join(dir, 'DESIGN.md'), 'utf8') });
const after = (await call('read_nodes', { depth: -1 })).nodes;
for (const old of before.filter(node => !/^0[78] —/.test(node.name))) {
  assert.deepEqual(after.find(node => node.id === old.id), old);
}
await call('save_document', { filePath: candidate });
console.log(JSON.stringify({ candidate, nodes: flatten(after).length, boards: after.length }));
