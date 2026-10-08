import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const candidate = path.join(dir, 'brand-family-complete-owner-review.op');
let sequence = 0;
let request = 0;
const portrait = `data:image/jpeg;base64,${fs.readFileSync('/Users/gustavanderson/Downloads/gustavonline/public/assets/gustav-portrait.jpg').toString('base64')}`;
const sourceIcons = fs.readFileSync('/Users/gustavanderson/Downloads/gustavonline/src/features/landing/components/BrandIcon.tsx', 'utf8');
const iconNames = ['youtube', 'instagram', 'linkedin', 'github'];
const iconPaths = Object.fromEntries(iconNames.map(name => {
  const match = sourceIcons.match(new RegExp(`if \\(name === "${name}"\\)[\\s\\S]*?<path d="([^"]+)"`));
  assert.ok(match, `Missing owned icon ${name}`);
  return [name, match[1]];
}));
const fill = color => [{ type: 'solid', color }];
const n = (type, name, x, y, width, height, extra = {}) => ({ id: `footer-${++sequence}`, type, name, x, y, width, height, ...extra });
const rect = (name, x, y, w, h, color) => n('rectangle', name, x, y, w, h, { fill: fill(color) });
const text = (content, x, y, w, h, size, color, extra = {}) => n('text', content, x, y, w, h,
  { content, fontFamily: 'Geist', fontSize: size, fontWeight: 400, lineHeight: 1.4,
    textGrowth: 'fixed-width-height', fill: fill(color), ...extra });
const frame = (name, x, y, w, h, color, children) => n('frame', name, x, y, w, h,
  { layout: 'none', clipContent: true, fill: color ? fill(color) : [], children });
const themes = {
  gustav: { paper: '#fbfaf7', ink: '#626262', line: '#e2d9cc' },
  sourdough: { paper: '#f8f2e8', ink: '#6b6258', line: '#e2d9cc' },
  arcit: { paper: '#fafafa', ink: '#626262', line: '#dddddd' },
};

function footer(brand, x, y, width, mobile = false, dark = false) {
  const theme = dark ? { ink: '#fff2df', line: '#625044' } : themes[brand];
  const height = mobile ? 146 : 90;
  const children = [rect('Shared footer divider', 0, 0, width, 1, theme.line)];
  const first = brand === 'gustav' ? 'onlinesourdough ↗' : 'gustavonline ↗';
  const second = brand === 'arcit' ? 'onlinesourdough ↗' : 'Arc’IT AI ↗';
  const portraitWidth = brand === 'gustav' ? 0 : 32;
  if (portraitWidth) children.push(n('rectangle', 'Gustav portrait · link to Gustav Online', 0, 26, 32, 32,
    { fill: [{ type: 'image', url: portrait, mode: 'fill' }], cornerRadius: 3 }));
  const start = portraitWidth ? 44 : 0;
  children.push(text(first, start, 31, 164, 30, mobile ? 15 : 17, theme.ink));
  children.push(text(second, mobile ? 170 : 214, 31, 176, 30, mobile ? 15 : 17, theme.ink));
  const iconsX = width - 168;
  iconNames.forEach((name, index) => children.push(n('path', `${name} · same public profile`,
    iconsX + index * 44, mobile ? 94 : 31, 24, 24,
    { d: iconPaths[name], fill: fill(theme.ink) })));
  return frame(`Shared footer · ${brand} · no self-link or copyright`, x, y, width, height, null, children);
}
function reverse(n) { if (n.children) { n.children.forEach(reverse); n.children.reverse(); } }
async function call(name, args = {}) {
  const response = await fetch('http://127.0.0.1:60865/mcp', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0',
      id: ++request, method: 'tools/call', params: { name, arguments: args } }) });
  assert.ok(response.ok);
  const result = await response.json();
  assert.ok(!result.error && !result.result?.isError, JSON.stringify(result));
  const value = result.result.content.find(item => item.type === 'text').text;
  try { return JSON.parse(value); } catch { return { text: value }; }
}
async function add(parent, data) { reverse(data); await call('insert_node', { parent, data, postProcess: false }); }
const flatten = roots => roots.flatMap(node => [node, ...flatten(node.children ?? [])]);

assert.ok(!fs.existsSync(candidate), 'Refusing to overwrite complete candidate');
const before = (await call('read_nodes', { depth: -1 })).nodes;
assert.equal(flatten(before).length, 701);
const family = before.find(node => node.name.startsWith('00 —'));
for (const brand of ['gustav', 'sourdough', 'arcit']) {
  const preview = family.children.find(node => node.type === 'frame' &&
    node.name.startsWith(brand === 'gustav' ? 'Gustav Online ·' : brand === 'sourdough' ? 'Online Sourdough ·' : 'Arc’IT AI ·'));
  assert.ok(preview);
  if (brand === 'gustav') await call('update_node', { nodeId: preview.id, data: { height: 964 } });
  else for (const old of preview.children.filter(node => node.y >= 1250)) await call('delete_node', { nodeId: old.id });
  await add(preview.id, footer(brand, 32, brand === 'gustav' ? 864 : 1250, 608));
}
for (const board of before.filter(node => /^0[456] —/.test(node.name))) {
  const mobile = board.name.startsWith('05');
  const personal = board.name.startsWith('06');
  const y = personal ? 890 : mobile ? 1874 : 1794;
  if (!personal) for (const old of board.children.filter(node => node.y >= y)) await call('delete_node', { nodeId: old.id });
  const padding = personal ? 46 : mobile ? 24 : 80;
  await add(board.id, footer(personal ? 'gustav' : 'arcit', padding, y, board.width - padding * 2, mobile));
  await call('update_node', { nodeId: board.id, data: { y: 3900 } });
}

const newsletter = before.find(node => node.name.startsWith('07 —'));
for (const preview of newsletter.children.filter(node => node.type === 'frame')) {
  const brand = preview.name.startsWith('gustavonline') ? 'gustav' : preview.name.startsWith('onlinesourdough') ? 'sourdough' : 'arcit';
  const thankYou = preview.name.includes('acknowledged signup');
  const y = thankYou ? 404 : preview.height + 16;
  await add(preview.id, footer(brand, 32, y, preview.width - 64));
  await call('update_node', { nodeId: preview.id,
    data: { height: y + 106, ...(thankYou ? { y: 1660 } : {}) } });
}
await call('update_node', { nodeId: newsletter.id, data: { height: 2280 } });
const responseLabel = newsletter.children.find(node => node.content?.startsWith('Efter bekræftet'));
await call('update_node', { nodeId: responseLabel.id, data: { y: 1582 } });

const mobileBoard = before.find(node => node.name.startsWith('08 —'));
for (const preview of mobileBoard.children.filter(node => node.type === 'frame')) {
  const brand = preview.name.startsWith('gustavonline') ? 'gustav' : preview.name.startsWith('onlinesourdough') ? 'sourdough' : 'arcit';
  await add(preview.id, footer(brand, 24, preview.height + 10, 342, true));
  await call('update_node', { nodeId: preview.id, data: { height: preview.height + 176 } });
}
for (const label of mobileBoard.children.filter(node => node.type === 'text' && node.y >= 1430)) {
  await call('update_node', { nodeId: label.id, data: { y: label.y + 146 } });
}
await call('update_node', { nodeId: mobileBoard.id, data: { y: 3900, height: 1806 } });
const personalNewsletter = before.find(node => node.name.startsWith('09 —'));
await add(personalNewsletter.id, footer('gustav', 80, 1160, 1120));
await call('update_node', { nodeId: personalNewsletter.id, data: { y: 6200, height: 1276 } });
for (const board of before.filter(node => /^0[123] —/.test(node.name))) {
  await call('update_node', { nodeId: board.id, data: { y: 2440 } });
}

const guide = frame('10 — Shared footer · links, portraits and social profiles', 1430, 6200, 2240, 1520, '#ebe6dd', [
  text('Samme footer. Forskellige afsendere.', 64, 52, 2112, 84, 52, '#26221e'),
  text('Søstersider til venstre. Samme fire sociale profiler til højre. Ingen copyright eller selv-links.', 64, 163, 2112, 74, 26, '#6b6258'),
  frame('Gustav Online · low footer', 64, 312, 2112, 190, '#fbfaf7', [footer('gustav', 48, 55, 2016)]),
  frame('Online Sourdough · retained brand signature above shared divider', 64, 580, 2112, 416, '#281a13', [
    text('onlinesourdough', 48, 63, 1600, 94, 64, '#fff2df', { fontFamily: 'Geist Pixel' }),
    footer('sourdough', 48, 280, 2016, false, true),
  ]),
  frame('Arc’IT AI · low footer', 64, 1074, 2112, 190, '#fafafa', [footer('arcit', 48, 55, 2016)]),
  text('På mobil: links på første række, sociale ikoner på næste. Portrættet er kun et link på de andre sites.', 64, 1345, 2112, 78, 26, '#6b6258'),
]);
reverse(guide);
await call('insert_node', { data: guide, postProcess: false });
const roots = (await call('read_nodes', { depth: 0 })).nodes;
const inserted = roots.find(node => node.name === guide.name);
await call('update_node', { nodeId: inserted.id, data: { x: guide.x, y: guide.y } });
await call('set_design_md', { markdown: fs.readFileSync(path.join(dir, 'DESIGN.md'), 'utf8') });
const after = (await call('read_nodes', { depth: -1 })).nodes;
const all = flatten(after);
assert.equal(after.length, 11);
assert.ok(!all.some(node => node.type === 'text' && /©|copyright 2026/i.test(node.content)));
const footers = all.filter(node => node.name.startsWith('Shared footer ·'));
assert.equal(footers.length, 19);
for (const footerNode of footers) {
  assert.equal(footerNode.children.filter(node => node.name.includes('same public profile')).length, 4);
  if (footerNode.name.includes('· gustav ·')) assert.ok(!footerNode.children.some(node => node.name.startsWith('Gustav portrait')));
}
await call('save_document', { filePath: candidate });
console.log(JSON.stringify({ candidate, nodes: all.length, boards: after.length, footerInstances: footers.length }));
