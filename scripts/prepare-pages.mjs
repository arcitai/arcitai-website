import { access, mkdir, readFile, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
for (const scene of ["morning", "day", "evening", "night"]) {
  await access(new URL(`assets/arcitai-${scene}-loop-v6.mp4`, dist));
  await access(new URL(`assets/arcitai-${scene}-poster-v6.jpg`, dist));
}
const html = await readFile(new URL("index.html", dist), "utf8");
const brand = "Arc’IT AI";
const origin = "https://arcitai.com";
const routes = [
  {
    path: "newsletter",
    title: `Newsletter | ${brand}`,
    description: "My notes on business architecture, software, and agentic engineering.",
  },
  {
    path: "newsletter/thank-you",
    title: `Newsletter signup | ${brand}`,
    description: "Your newsletter signup.",
    noindex: true,
  },
  {
    path: "project",
    title: "Project inquiry | Arc’IT AI",
    description:
      "Tell me about the work you want to improve, your existing systems, and the project I can take care of.",
  },
];
for (const route of routes) {
  const dir = new URL(`${route.path}/`, dist);
  await mkdir(dir, { recursive: true });
  const url = `${origin}/${route.path}/`;
  let page = html
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${route.description}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${route.title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${route.description}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${route.title}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${route.description}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
  if (!page.includes('rel="canonical"'))
    page = page.replace("</head>", `<link rel="canonical" href="${url}">\n</head>`);
  if (route.noindex)
    page = page
      .replace(/<meta name="robots"[^>]*>/, "")
      .replace("</head>", '<meta name="robots" content="noindex, follow">\n</head>');
  await writeFile(new URL("index.html", dir), page);
}
await writeFile(new URL(".nojekyll", dist), "");
console.log(`Prepared ${routes.length} direct routes for ${brand}.`);
