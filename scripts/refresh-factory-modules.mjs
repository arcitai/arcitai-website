import { writeFile, rename } from "node:fs/promises";

// Only these existing public repositories are module sources. Add a reviewed
// mapping when a separate Research or Defence module actually has a repository.
const repositories = {
  software: "arcitai/factory",
  powerbi: "arcitai/Agentic-PowerBI-System",
};
const sources = Object.fromEntries(
  await Promise.all(
    Object.entries(repositories).map(async ([id, repository]) => {
      const response = await fetch(`https://api.github.com/repos/${repository}`, {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok)
        throw new Error(`GitHub metadata unavailable for ${repository}: ${response.status}`);
      const repo = await response.json();
      if (
        repo.full_name !== repository ||
        repo.private ||
        repo.archived ||
        repo.html_url !== `https://github.com/${repository}`
      ) {
        throw new Error(`Repository is not an active public source: ${repository}`);
      }
      return [
        id,
        {
          repository,
          url: repo.html_url,
          description: typeof repo.description === "string" ? repo.description : "",
        },
      ];
    }),
  ),
);
const path = new URL("../public/data/factory-module-sources.json", import.meta.url);
const temporary = new URL("../public/data/factory-module-sources.json.tmp", import.meta.url);
await writeFile(
  temporary,
  JSON.stringify({ checkedAt: new Date().toISOString(), sources }, null, 2) + "\n",
);
await rename(temporary, path);
console.log(`Updated ${Object.keys(sources).length} verified public module sources.`);
