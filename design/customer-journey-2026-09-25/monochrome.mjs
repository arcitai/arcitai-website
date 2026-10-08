import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const candidate = path.join(dir, 'brand-family-canvas-v4-owner-review.op');
const endpoint = 'http://127.0.0.1:60865/mcp';
let requestId = 0;

async function call(name, args = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++requestId, method: 'tools/call',
      params: { name, arguments: args } }),
  });
  assert.ok(response.ok, `MCP HTTP ${response.status}`);
  const result = await response.json();
  assert.ok(!result.error && !result.result?.isError, JSON.stringify(result));
  const text = result.result?.content?.find(item => item.type === 'text')?.text;
  assert.equal(typeof text, 'string', `No text result for ${name}`);
  try { return JSON.parse(text); } catch { return { text }; }
}

function flatten(roots) {
  return roots.flatMap(node => [node, ...flatten(node.children ?? [])]);
}

function grid(width, height, step, top) {
  let id = 0;
  const line = (x, y, w, h) => ({
    id: `neutral-grid-${++id}`, type: 'rectangle', name: 'Quiet technical grid line',
    x, y, width: w, height: h, fill: [{ type: 'solid', color: '#ededed' }],
  });
  const children = [];
  for (let x = step; x < width; x += step) children.push(line(x, 0, 1, height));
  for (let y = step; y < height; y += step) children.push(line(0, y, width, 1));
  return { id: 'neutral-grid', type: 'frame', name: 'Arc’IT · quiet hero grid',
    x: 0, y: top, width, height, layout: 'none', clipContent: true, fill: [], children };
}

function contrast(a, b) {
  const luminance = hex => {
    const rgb = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255)
      .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + .05) / (dark + .05);
}

// The previous durable candidate remains the recovery point; reject repeats before writes.
assert.ok(!fs.existsSync(candidate), 'Refusing to overwrite the v4 candidate');
const before = (await call('read_nodes', { depth: -1 })).nodes;
assert.equal(before.length, 7);
assert.equal(flatten(before).length, 430);
const family = before.find(node => node.name.startsWith('00 —'));
assert.ok(family);
const compact = family.children.find(node => node.name === 'Arc’IT AI · same family, delivery job');
const sourdough = family.children.find(node => node.name === 'Online Sourdough · existing family adapted');
const personal = family.children.find(node => node.name.startsWith('Gustav Online · founder'));
const arcit = [compact, ...before.filter(node => /^0[45] —/.test(node.name))];
assert.ok(sourdough && personal && arcit.every(Boolean));
assert.equal(arcit.length, 3);
assert.equal(compact.fill[0].color, '#f1f4ee');
const sourceGrid = sourdough.children.filter(node => node.name === 'Quiet source grid');
assert.equal(sourceGrid.length, 33);
const label = family.children.find(node => node.content?.startsWith('Gustav: chalk'));
assert.ok(label);

const palette = {
  '#f1f4ee': '#fafafa', '#18211d': '#202020', '#5b665d': '#626262',
  '#d6ded4': '#dddddd', '#235348': '#202020', '#a9bba9': '#b6b6b6',
  '#d7e2d3': '#e0e0e0', '#8ea996': '#a3a3a3', '#93ad98': '#a3a3a3',
};
const recolor = fills => fills.map(fill => fill.type === 'solid' && palette[fill.color]
  ? { ...fill, color: palette[fill.color] } : fill);

for (const node of flatten(arcit)) {
  const data = {};
  if (node.fill) data.fill = recolor(node.fill);
  if (node.stroke?.fill) data.stroke = { ...node.stroke, fill: recolor(node.stroke.fill) };
  if (node.cornerRadius > 0) data.cornerRadius = node.fill?.some(fill => fill.type === 'image') ? 4 : 2;
  if (node.id === compact.id) data.cornerRadius = 0;
  if (Object.keys(data).length) await call('update_node', { nodeId: node.id, data });
}

for (const node of sourceGrid) await call('delete_node', { nodeId: node.id });
for (const node of sourdough.children.filter(node => node.type === 'frame')) {
  await call('update_node', { nodeId: node.id, data: { cornerRadius: 20 } });
}

for (const board of arcit) {
  const top = board === compact ? 80 : board.name.startsWith('04') ? 102 : 89;
  const bottom = board === compact ? 906 : board.name.startsWith('04') ? 1110 : 817;
  const step = board === compact ? 56 : board.name.startsWith('04') ? 80 : 40;
  // Native inserts append behind existing siblings; only the hero receives a grid.
  await call('insert_node', { parent: board.id,
    data: grid(board.width, bottom - top, step, top), postProcess: false });
}
await call('update_node', { nodeId: label.id, data: {
  content: 'Gustav: chalk / ink     ·     Online Sourdough: warm / soft     ·     Arc’IT: monochrome / grid',
} });
await call('set_design_md', { markdown: fs.readFileSync(path.join(dir, 'DESIGN.md'), 'utf8') });

const after = (await call('read_nodes', { depth: -1 })).nodes;
const finalFamily = after.find(node => node.id === family.id);
assert.deepEqual(finalFamily.children.find(node => node.id === personal.id), personal);
for (const original of before.filter(node => !/^0[045] —/.test(node.name))) {
  assert.deepEqual(after.find(node => node.id === original.id), original,
    `Unrelated board changed: ${original.name}`);
}
const finalArcit = flatten([finalFamily.children.find(node => node.id === compact.id),
  ...after.filter(node => /^0[45] —/.test(node.name))]);
for (const node of finalArcit) {
  for (const fill of [...(node.fill ?? []), ...(node.stroke?.fill ?? [])]) {
    if (fill.type !== 'solid') continue;
    assert.match(fill.color, /^#([0-9a-f]{2})\1\1$/i, `Non-neutral fill: ${node.name}`);
  }
}
const ratios = { body: contrast('#202020', '#fafafa'),
  secondary: contrast('#626262', '#fafafa'), button: contrast('#fafafa', '#202020') };
assert.ok(Object.values(ratios).every(ratio => ratio >= 4.5));
await call('save_document', { filePath: candidate });
console.log(JSON.stringify({ candidate, nodes: flatten(after).length, boards: after.length,
  sourceGridRemoved: sourceGrid.length, contrast: ratios,
  unchanged: 'Personal previews and all three customer-journey maps' }, null, 2));
