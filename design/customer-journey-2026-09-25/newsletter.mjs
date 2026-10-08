import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const candidate = path.join(dir, 'brand-family-canvas-v5-owner-review.op');
let sequence = 0;
let request = 0;
const themes = {
  gustav: { name: 'gustavonline', paper: '#fbfaf7', ink: '#202020', muted: '#626262', line: '#e2d9cc', radius: 6 },
  sourdough: { name: 'onlinesourdough', paper: '#f8f2e8', ink: '#2b1b12', muted: '#6b6258', line: '#e2d9cc', radius: 10 },
  arcit: { name: 'Arc’IT AI', paper: '#fafafa', ink: '#202020', muted: '#626262', line: '#dddddd', radius: 2 },
};
const fill = color => [{ type: 'solid', color }];
const node = (type, name, x, y, width, height, data = {}) => ({
  id: `newsletter-${++sequence}`, type, name, x, y, width, height, ...data,
});
const rect = (name, x, y, w, h, color, radius = 0) => node('rectangle', name, x, y, w, h,
  { fill: fill(color), cornerRadius: radius });
const frame = (name, x, y, w, h, color, children, radius = 0) => node('frame', name, x, y, w, h,
  { layout: 'none', clipContent: true, fill: color ? fill(color) : [], children, cornerRadius: radius });
const text = (content, x, y, w, h, size = 18, color = '#202020', extra = {}) => node('text',
  content.split('\n')[0], x, y, w, h, { content, fontFamily: 'Geist', fontSize: size,
    fontWeight: 400, lineHeight: 1.4, textGrowth: 'fixed-width-height', fill: fill(color), ...extra });
const title = (content, x, y, w, h, size, color) => text(content, x, y, w, h, size, color,
  { fontFamily: 'Geist Pixel', lineHeight: 1.1 });
const moon = (x, y, color) => node('path', 'Shared moon · light-theme state', x, y, 18, 20,
  { d: 'M8 0A9 9 0 1 0 18 11A8 8 0 0 1 8 0Z', fill: fill(color) });
const ownMark = `data:image/png;base64,${fs.readFileSync('/Users/gustavanderson/Downloads/gustavonline/public/assets/gustav-pixel-g-384.png').toString('base64')}`;

function header(theme, width, mobile = false) {
  const left = mobile ? 24 : 32;
  const items = [rect('Header rule', left, 78, width - left * 2, 1, theme.line)];
  let wordmarkX = left;
  if (theme === themes.gustav) {
    items.push(node('rectangle', 'Existing Gustav mark', left, 27, 24, 24,
      { fill: [{ type: 'image', url: ownMark, mode: 'fit' }] }));
    wordmarkX += 36;
  }
  items.push(text(theme.name, wordmarkX, 25, mobile ? 170 : 300, 34, mobile ? 18 : 22, theme.ink));
  if (theme !== themes.gustav) items.push(text('Offers ⌄', width - (mobile ? 172 : 260), 29, 65, 28, 14, theme.muted));
  items.push(text('Newsletter', width - (mobile ? 109 : 170), 29, mobile ? 73 : 102, 28, 14, theme.ink));
  items.push(moon(width - (mobile ? 34 : 47), 30, theme.muted));
  return items;
}

function subtleGrid(width, height, top, step = 56) {
  const items = [];
  for (let x = step; x < width; x += step) items.push(rect('Quiet technical grid line', x, top, 1, height, '#ededed'));
  for (let y = top + step; y < top + height; y += step) items.push(rect('Quiet technical grid line', 0, y, width, 1, '#ededed'));
  return items;
}

function subscribeForm(theme, x, y, width, mobile = false) {
  const h = 56;
  const buttonWidth = mobile ? width : 142;
  const inputWidth = mobile ? width : width - buttonWidth - 12;
  const buttonY = mobile ? y + 106 : y + 34;
  const buttonX = mobile ? x : x + inputWidth + 12;
  return [text('Email address', x, y, width, 27, 17, theme.ink),
    node('rectangle', 'Email input · native design only', x, y + 34, inputWidth, h,
      { fill: fill('#ffffff'), stroke: { fill: fill(theme.line), thickness: 1 }, cornerRadius: theme.radius }),
    text('you@example.com', x + 16, y + 50, inputWidth - 32, 28, 17, theme.muted),
    frame('Subscribe action · requires acknowledged response', buttonX, buttonY, buttonWidth, h, theme.ink,
      [text('Subscribe', 8, 15, buttonWidth - 16, 30, 17, theme.paper, { fontWeight: 500, textAlign: 'center' })], theme.radius),
    text('One newsletter from Gustav Online.\nUnsubscribe anytime.', x, mobile ? y + 188 : y + 114, width, 60, 16, theme.muted)];
}

function emptyShelf(x, y, width, compact = false) {
  const center = Math.round(width / 2);
  const bookWidth = compact ? 108 : 152;
  const bookHeight = compact ? 142 : 194;
  const shelfY = bookHeight + 20;
  // This is the existing component's honest empty/bookend state, not invented issues.
  return frame('Existing bookshelf · empty-state composition, not live WebGL', x, y, width, shelfY + 98, null, [
    rect('Shelf cast shadow', 12, shelfY + 9, width - 24, 8, '#e2d9cc', 4),
    rect('Shelf timber edge', 0, shelfY, width, 9, '#807365', 3),
    rect('Bookend spine', center - bookWidth / 2 - 9, 12, 12, bookHeight + 4, '#c7b395', 2),
    rect('Archive bookend · no published issue', center - bookWidth / 2, 8, bookWidth, bookHeight, '#e4d6c2', 3),
    rect('Bookend accent', center - bookWidth / 2 + 16, 31, bookWidth - 32, 3, '#d86f35'),
    title('Archive\nstarts here.', center - bookWidth / 2 + 16, 61, bookWidth - 28, 74, compact ? 18 : 24, '#34302b'),
    text('No issues published yet.', 0, shelfY + 38, width, 35, compact ? 15 : 17, '#626262', { textAlign: 'center' }),
  ]);
}

function signup(theme, x, y, width, mobile = false) {
  const left = mobile ? 24 : 48;
  const contentWidth = width - left * 2;
  const height = theme === themes.gustav ? (mobile ? 1100 : 1050) : (mobile ? 755 : 720);
  const children = theme === themes.arcit ? subtleGrid(width, height - 80, 80, mobile ? 40 : 56) : [];
  children.push(...header(theme, width, mobile));
  const headingTop = mobile ? 142 : 152;
  children.push(title('Notes from\nthe work.', left, headingTop, contentWidth, mobile ? 96 : 112, mobile ? 36 : 46, theme.ink));
  children.push(text('A newsletter by Gustav Anderson.', left, mobile ? 266 : 296, contentWidth, mobile ? 52 : 34, 18, theme.ink));
  children.push(text(mobile ? 'Experiments, workflows and lessons\nfrom using AI in a real business.' : 'Experiments, workflows and lessons from\nusing AI in a real business.',
    left, mobile ? 332 : 354, contentWidth, 75, mobile ? 17 : 20, theme.muted));
  children.push(...subscribeForm(theme, left, mobile ? 437 : 461, contentWidth, mobile));
  if (theme === themes.gustav) {
    const archiveY = mobile ? 734 : 718;
    children.push(rect('Archive rule', left, archiveY - 24, contentWidth, 1, theme.line),
      text('The bookshelf', left, archiveY, contentWidth, 42, mobile ? 24 : 26, theme.ink),
      emptyShelf(left + 16, archiveY + 66, contentWidth - 32, mobile));
  }
  return frame(`${theme.name} · newsletter${mobile ? ' · mobile' : ''}`, x, y, width, height,
    theme.paper, children, theme === themes.arcit ? 0 : 10);
}

function thanks(theme, x, y, width) {
  const action = theme === themes.gustav ? 'Back to Gustav Online ↗'
    : theme === themes.sourdough ? 'Explore the menu ↗' : 'Back to Arc’IT AI ↗';
  return frame(`${theme.name} · acknowledged signup / thank you`, x, y, width, 380, theme.paper,
    [...header(theme, width), title('You’re on the list.', 48, 132, width - 96, 57, 38, theme.ink),
      text('You’ll hear from Gustav when the next note is ready.', 48, 207, width - 96, 66, 19, theme.muted),
      text(action, 48, 302, width - 96, 36, 19, theme.ink, { fontWeight: 500 })], theme === themes.arcit ? 0 : 10);
}

function overview() {
  const children = [text('Ét newsletter. Tre indgange.', 64, 52, 2080, 84, 58, '#26221e', { fontWeight: 500 }),
    text('Samme Gustav, indhold og abonnement. Kun Gustav Online har bogreolen.', 64, 169, 2080, 54, 27, '#6b6258')];
  [themes.gustav, themes.sourdough, themes.arcit].forEach((theme, index) => {
    const x = 64 + index * 720;
    children.push(signup(theme, x, 274, 672));
    children.push(thanks(theme, x, 1440, 672));
  });
  children.push(text('Efter bekræftet tilmelding fra serveren →', 64, 1360, 2080, 44, 24, '#6b6258'));
  return frame('07 — Newsletter family · signup and thank you', 2400, 0, 2240, 1900, '#ebe6dd', children);
}

function mobileOverview() {
  const children = [text('Newsletter · mobil', 64, 52, 1360, 75, 50, '#26221e', { fontWeight: 500 }),
    text('Én formular. Samme afsender. Bogreol kun på den personlige side.', 64, 145, 1370, 68, 25, '#6b6258')];
  [themes.gustav, themes.sourdough, themes.arcit].forEach((theme, index) => children.push(signup(theme, 64 + index * 454, 262, 390, true)));
  children.push(text('Formularadfærd ved implementering', 64, 1430, 1370, 48, 27, '#26221e'),
    text('Pending: Subscribing…   ·   Fejl: email bevares, ingen redirect.\nSuccess: takkeside efter serverens svar. Eventuel email-bekræftelse vises som en separat tilstand.',
      64, 1502, 1370, 100, 21, '#6b6258'));
  return frame('08 — Newsletter · mobile and form behavior', 3580, 3590, 1500, 1660, '#ebe6dd', children);
}

function personalDesktop() {
  const theme = themes.gustav;
  const children = [...header(theme, 1280),
    text('A newsletter by Gustav Anderson.', 330, 158, 620, 35, 19, theme.ink),
    title('Notes from the work.', 330, 219, 650, 72, 52, theme.ink),
    text('Experiments, workflows and lessons from using AI\nin a real business.', 330, 317, 620, 76, 21, theme.muted),
    ...subscribeForm(theme, 330, 437, 620),
    rect('Archive rule', 200, 688, 880, 1, theme.line),
    text('The bookshelf', 200, 730, 880, 50, 30, theme.ink),
    emptyShelf(278, 821, 724),
  ];
  return frame('09 — Gustav Online · newsletter and existing bookshelf', 0, 5830, 1280, 1230, theme.paper, children);
}

async function call(name, args = {}) {
  const response = await fetch('http://127.0.0.1:60865/mcp', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0',
      id: ++request, method: 'tools/call', params: { name, arguments: args } }) });
  assert.ok(response.ok);
  const result = await response.json();
  assert.ok(!result.error && !result.result?.isError, JSON.stringify(result));
  const resultText = result.result?.content?.find(item => item.type === 'text')?.text;
  assert.equal(typeof resultText, 'string');
  try { return JSON.parse(resultText); } catch { return { text: resultText }; }
}
function flatten(roots) { return roots.flatMap(item => [item, ...flatten(item.children ?? [])]); }
function reversePaint(n) { if (n.children) { n.children.forEach(reversePaint); n.children.reverse(); } }

assert.ok(!fs.existsSync(candidate), 'Refusing to overwrite v5');
const before = (await call('read_nodes', { depth: -1 })).nodes;
assert.equal(before.length, 7);
assert.equal(flatten(before).length, 479);
const family = before.find(n => n.name.startsWith('00 —'));
assert.ok(family);
const compactHeaders = family.children.filter(n => /^Online Sourdough ·|^Arc’IT AI ·/.test(n.name));
assert.equal(compactHeaders.length, 2);
for (const preview of compactHeaders) {
  const offers = preview.children.find(n => n.content === 'Offers ⌄');
  assert.ok(offers);
  const color = preview.name.startsWith('Arc') ? '#626262' : '#6b6258';
  await call('update_node', { nodeId: offers.id, data: { x: 402, width: 80 } });
  await call('insert_node', { parent: preview.id,
    data: text('Newsletter', 496, 28, 108, 28, 15, color), postProcess: false });
}
const desktop = before.find(n => n.name.startsWith('04 —'));
const mobile = before.find(n => n.name.startsWith('05 —'));
await call('update_node', { nodeId: desktop.children.find(n => n.content === 'All offers ↗').id,
  data: { content: 'Offers ⌄', x: 927, width: 88 } });
await call('insert_node', { parent: desktop.id, data: text('Newsletter', 1030, 40, 117, 28, 16, '#202020'), postProcess: false });
await call('update_node', { nodeId: mobile.children.find(n => n.content === 'All offers ↗').id,
  data: { content: 'Offers ⌄', x: 186, width: 62, fontSize: 14 } });
await call('update_node', { nodeId: mobile.children.find(n => n.content === 'Arc’IT AI').id,
  data: { width: 146, fontSize: 22 } });
await call('insert_node', { parent: mobile.id, data: text('Newsletter', 258, 32, 78, 28, 14, '#202020'), postProcess: false });

const boards = [overview(), mobileOverview(), personalDesktop()];
for (const board of boards) { reversePaint(board); await call('insert_node', { data: board, postProcess: false }); }
const liveRoots = (await call('read_nodes', { depth: 0 })).nodes;
for (const board of boards) {
  const inserted = liveRoots.find(n => n.name === board.name);
  assert.ok(inserted);
  await call('update_node', { nodeId: inserted.id, data: { x: board.x, y: board.y } });
}
await call('set_design_md', { markdown: fs.readFileSync(path.join(dir, 'DESIGN.md'), 'utf8') });
const after = (await call('read_nodes', { depth: -1 })).nodes;
assert.equal(after.length, 10);
for (const original of before.filter(n => /^0[1236] —/.test(n.name))) {
  assert.deepEqual(after.find(n => n.id === original.id), original, `Unexpected change: ${original.name}`);
}
const all = flatten(after);
assert.equal(all.filter(n => n.name.startsWith('Existing bookshelf ·')).length, 3);
assert.equal(all.filter(n => n.content === 'You’re on the list.').length, 3);
assert.equal(all.filter(n => n.content === 'Subscribe').length, 7);
await call('save_document', { filePath: candidate });
console.log(JSON.stringify({ candidate, nodes: all.length, boards: after.length,
  notes: 'Three branded signup/thank-you studies; bookshelf only in Gustav previews; no live submissions.' }, null, 2));
