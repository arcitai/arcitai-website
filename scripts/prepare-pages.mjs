import { access, mkdir, readFile, writeFile } from "node:fs/promises";

const dist = new URL(
  process.argv.includes("--review") ? "../output/family-preview/" : "../dist/",
  import.meta.url,
);
for (const scene of ["morning", "day", "evening", "night"]) {
  await access(new URL(`assets/arcitai-${scene}-loop-v6.mp4`, dist));
  await access(new URL(`assets/arcitai-${scene}-poster-v6.jpg`, dist));
}

const html = await readFile(new URL("index.html", dist), "utf8");
const origin = "https://arcitai.com";
const pages = [
  {
    path: "",
    title: "Arc’IT AI | Put AI to work across your teams",
    description:
      "Data and AI consultancy shaped around your business. Free one-off consultations and custom projects, built around your data, context and ways of working.",
    lastmod: "2026-11-22",
    body: `<section><h1>Put AI to work across your teams</h1><p>Use AI agents to investigate issues, analyse information and develop software with the business data and context your teams share. Arc’IT AI builds around your systems, with agreed access and human review.</p><h2>Custom data and AI projects</h2><p>Start with your business, data and existing systems. Agree the project scope, the access, and how we will check the result.</p><p><a href="/project/">Tell me about your project</a> · <a href="https://github.com/arcitai/agentic-systems">Explore Agentic Systems</a></p><p>For founders and small teams, visit <a href="https://onlinesourdough.com/">onlinesourdough</a>. Learn about <a href="https://gustavonline.com/">Gustav Anderson</a>.</p></section>`,
  },
  {
    path: "project",
    title: "Discuss your project | Arc’IT AI",
    description:
      "Share your project ideas, current stage and goals. Data and AI shaped around your business, from an initial direction to practical delivery.",
    lastmod: "2026-11-22",
    body: `<section><h1>Tell me about your project</h1><p>Share your ideas, where things stand and what you want to achieve. Whether you are starting something new or building on existing work, we can shape the right approach for your business.</p><p>Prefer to talk it through? <a href="https://calendar.notion.so/meet/gustavanderson/20min-one-off-consultation">Book a free 20-minute consultation</a>.</p><h2>How I work</h2><p>I start with how your business runs and the tools, environment and team you already have. I agree scope and acceptance criteria with you, then test the work and make remaining risks clear before handover.</p><p><a href="/">Back to Arc’IT AI</a></p></section>`,
  },
  {
    path: "newsletter",
    title: "Newsletter | Arc’IT AI",
    description:
      "Ideas, experiments and lessons from working with data, AI and agentic engineering.",
    lastmod: "2026-11-22",
    body: `<section><h1>Notes from the work</h1><p>My newsletter. I am Gustav Anderson. Get ideas and lessons from my projects with data, AI and software. Take what fits the work you are doing.</p><p><a href="/">Back to Arc’IT AI</a> · <a href="/project/">Discuss your project</a></p></section>`,
  },
  {
    path: "newsletter/thank-you",
    title: "Newsletter signup | Arc’IT AI",
    description: "Your newsletter signup with Gustav Anderson.",
    noindex: true,
    body: `<section><h1>Notes from the work</h1><p>Return to <a href="/">Arc’IT AI</a> or revisit the <a href="/newsletter/">newsletter page</a>.</p></section>`,
  },
];

for (const page of pages) {
  const url = `${origin}/${page.path ? `${page.path}/` : ""}`;
  const pageHtml = withPage(html, page, url);
  const directory = new URL(page.path ? `${page.path}/` : "./", dist);
  if (page.path) await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), pageHtml);
}

const sitemapEntries = pages
  .filter((page) => !page.noindex)
  .map((page) => {
    const path = page.path ? `${page.path}/` : "";
    return `  <url><loc>${origin}/${path}</loc><lastmod>${page.lastmod}</lastmod></url>`;
  });
await writeFile(
  new URL("sitemap.xml", dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</urlset>\n`,
);

await writeFile(new URL("404.html", dist), notFoundHtml());

await writeFile(new URL(".nojekyll", dist), "");
console.log(`Prepared ${pages.length} direct routes and a not-found page for Arc’IT AI.`);

function withPage(source, page, url) {
  let result = replaceRequired(
    source,
    /<title>.*?<\/title>/is,
    `<title>${escapeHtml(page.title)}</title>`,
    "<title>",
  );
  result = replaceRequired(
    result,
    /<main id="seo-prerender"[^>]*>[\s\S]*?<\/main>/i,
    `<main id="seo-prerender" aria-label="Arc’IT AI">${page.body}</main>`,
    "#seo-prerender",
  );
  result = replaceMeta(result, "name", "description", page.description);
  result = replaceMeta(result, "property", "og:title", page.title);
  result = replaceMeta(result, "property", "og:description", page.description);
  result = replaceMeta(result, "property", "og:url", url);
  result = replaceMeta(result, "name", "twitter:title", page.title);
  result = replaceMeta(result, "name", "twitter:description", page.description);
  result = replaceMeta(result, "property", "og:site_name", "Arc’IT AI");
  result = replaceOrInsert(
    result,
    /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi,
    `<link rel="canonical" href="${escapeAttribute(url)}" />`,
    "canonical link",
  );
  result = removeMeta(result, "name", "robots");
  if (page.noindex)
    result = insertBeforeHeadEnd(result, '<meta name="robots" content="noindex, follow">');
  result = result.replace(
    /<script\b(?=[^>]*\bid=["']seo-jsonld["'])[^>]*>[\s\S]*?<\/script>\s*/gi,
    () => "",
  );
  return insertBeforeHeadEnd(
    result,
    `<script id="seo-jsonld" type="application/ld+json">${jsonLd(url, page)}</script>`,
  );
}

function replaceMeta(html, attribute, name, content) {
  const key = escapeRegExp(name);
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${key}["'])[^>]*>`, "gi");
  const tag = `<meta ${attribute}="${name}" content="${escapeAttribute(content)}" />`;
  return replaceOrInsert(html, pattern, tag, `meta ${attribute}=${name}`);
}

function removeMeta(html, attribute, name) {
  const key = escapeRegExp(name);
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${key}["'])[^>]*>\\s*`, "gi");
  return html.replace(pattern, () => "");
}

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Could not find ${label} in the HTML shell.`);
  return html.replace(pattern, () => replacement);
}

function replaceOrInsert(html, pattern, replacement, label) {
  let replaced = false;
  const result = html.replace(pattern, () => {
    if (replaced) return "";
    replaced = true;
    return replacement;
  });
  if (replaced) return result;
  return insertBeforeHeadEnd(html, replacement, label);
}

function insertBeforeHeadEnd(html, value, label = "head element") {
  if (!/<\/head>/i.test(html)) throw new Error(`Could not find </head> to insert ${label}.`);
  return html.replace(/<\/head>/i, () => `${value}\n</head>`);
}

function notFoundHtml() {
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<meta name="robots" content="noindex, nofollow" />\n<meta name="description" content="This page could not be found." />\n<title>Page not found | Arc’IT AI</title>\n</head>\n<body>\n<main><h1>Page not found</h1><p>This Arc’IT AI page does not exist.</p><p><a href="/">Return to Arc’IT AI</a> · <a href="/project/">Discuss your project</a></p></main>\n</body>\n</html>\n`;
}

function jsonLd(url, page) {
  const personId = "https://gustavonline.com/#person";
  const organizationId = `${origin}/#organization`;
  const onlineId = "https://onlinesourdough.com/#organization";
  const graph = [
    {
      "@type": "Person",
      "@id": personId,
      name: "Gustav Anderson",
      alternateName: ["gustavonline", "Gustav Online"],
      url: "https://gustavonline.com/",
      email: "hello@gustavonline.com",
      jobTitle: "Founder",
      sameAs: [
        "https://www.youtube.com/@gustavonline",
        "https://www.linkedin.com/in/gustavandersonn/",
        "https://x.com/gustavonline",
        "https://github.com/gustavonline",
      ],
      worksFor: [{ "@id": organizationId }, { "@id": onlineId }],
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Arc’IT AI",
      url: `${origin}/`,
      founder: { "@id": personId },
      sameAs: ["https://github.com/arcitai"],
    },
    {
      "@type": "Organization",
      "@id": onlineId,
      name: "onlinesourdough",
      url: "https://onlinesourdough.com/",
      founder: { "@id": personId },
      sameAs: ["https://github.com/onlinesourdough"],
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: "Arc’IT AI",
      url: `${origin}/`,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": `${origin}/#website` },
      publisher: { "@id": organizationId },
    },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e");
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
