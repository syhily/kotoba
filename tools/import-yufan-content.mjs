import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd());
const sourceRoot = path.join(workspaceRoot, "yufan.me", "src", "content");
const outputDir = path.join(workspaceRoot, "tools", "import-output");
const outputFile = path.join(outputDir, "yufan-content-manifest.json");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: {}, body: raw };
  const yaml = match[1];
  const body = raw.slice(match[0].length);
  const frontmatter = {};
  for (const line of yaml.split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!key) continue;
    frontmatter[key] = value;
  }
  return { frontmatter, body };
}

function inferCollection(relativePath) {
  if (relativePath.startsWith(`posts${path.sep}`)) return "posts";
  if (relativePath.startsWith(`pages${path.sep}`)) return "pages";
  if (
    relativePath.includes(`${path.sep}categories.`) ||
    relativePath.includes(`${path.sep}categories.yml`)
  ) {
    return "categories";
  }
  if (relativePath.includes(`${path.sep}tags.`) || relativePath.includes(`${path.sep}tags.yml`)) {
    return "tags";
  }
  if (
    relativePath.includes(`${path.sep}friends.`) ||
    relativePath.includes(`${path.sep}friends.yml`)
  ) {
    return "friends";
  }
  return "unknown";
}

async function main() {
  const files = await walk(sourceRoot);
  const manifest = [];
  for (const filePath of files) {
    if (!/\.(md|mdx|ya?ml)$/i.test(filePath)) continue;
    const relativePath = path.relative(sourceRoot, filePath);
    const raw = await readFile(filePath, "utf8");
    const parsed = parseFrontmatter(raw);
    const id = path.basename(relativePath).replace(/\.(md|mdx|ya?ml)$/i, "");

    manifest.push({
      collection: inferCollection(relativePath),
      id,
      sourcePath: relativePath,
      frontmatter: parsed.frontmatter,
      bodyPreview: parsed.body.slice(0, 200),
    });
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    outputFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceRoot,
        total: manifest.length,
        items: manifest,
      },
      null,
      2,
    ),
    "utf8",
  );

  process.stdout.write(`Generated manifest: ${outputFile}\nItems: ${manifest.length}\n`);
}

main().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
});
