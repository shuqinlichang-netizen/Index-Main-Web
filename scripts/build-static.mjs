import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const outputDir = join(projectRoot, "dist");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

// Keep every HTML entry point available while publishing only runtime files.
const entries = (await readdir(projectRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name);

for (const entry of entries) {
  await cp(join(projectRoot, entry), join(outputDir, entry));
}

for (const directory of ["assets", "src"]) {
  await cp(join(projectRoot, directory), join(outputDir, directory), { recursive: true });
}

console.log(`Static site built: ${entries.length} HTML entries -> dist/`);
