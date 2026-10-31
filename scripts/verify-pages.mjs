import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout } from "node:timers/promises";
import { pathToFileURL } from "node:url";

const origins = process.argv.slice(2);
if (!origins.length) throw new Error("Pass at least one site origin to verify.");

const dist = pathToFileURL(`${resolve("dist")}/`);
const routes = ["", "project/", "newsletter/", "newsletter/thank-you/"];
const files = new Map();
for (const route of routes) {
  const html = await readFile(new URL(`${route}index.html`, dist));
  files.set(`/${route}`, html);
  for (const [, path] of html
    .toString()
    .matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))"/g)) {
    files.set(path, await readFile(new URL(path.slice(1), dist)));
  }
}

for (const value of origins) {
  const origin = new URL(value);
  if (
    !/^https?:$/.test(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new Error("Expected an HTTP(S) origin without credentials, a path or query.");

  // Pages and custom domains can take a moment to serve the new deployment.
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      await Promise.all(
        [...files].map(async ([path, expected]) => {
          const response = await fetch(new URL(path, origin), {
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
          });
          if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
          const actual = Buffer.from(await response.arrayBuffer());
          if (!actual.equals(expected))
            throw new Error(`${path}: published bytes differ from dist`);
        }),
      );
      console.log(`${origin.origin}: ${files.size} pages/assets match the release artifact.`);
      break;
    } catch (error) {
      if (attempt === 6)
        throw new Error(`${origin.origin}: release verification failed`, { cause: error });
      console.warn(`${origin.origin}: attempt ${attempt}/6: ${error.message}`);
      await setTimeout(5_000);
    }
  }
}
