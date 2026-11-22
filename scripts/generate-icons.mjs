// Generates the Material Symbols Outlined icon registry (wght 500 — 400 is too thin on 14–16 px buttons).
//
//   npm run icons
//
// Reads : src/app/shared/ui/icon/icons.manifest.json  ({ outlined: [...], filled: [...] })
// Writes: src/app/shared/ui/icon/icons.generated.ts
//
// SVGs are fetched from the CDN at a pinned version; the package is NOT a devDependency (23k files, it would
// slow down Docker `npm ci`). The generated file is committed — the build does not depend on this script or the network.
// New icon: add its name to the manifest (same as the name on https://fonts.google.com/icons), run the script.
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION = '0.48.0';
const BASE = `https://cdn.jsdelivr.net/npm/@material-symbols/svg-500@${VERSION}/outlined`;

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(root, 'src/app/shared/ui/icon');
const manifest = JSON.parse(await readFile(resolve(dir, 'icons.manifest.json'), 'utf8'));

const outlined = [...new Set(manifest.outlined)].sort();
const filled = [...new Set(manifest.filled)].sort();
const unknownFilled = filled.filter(n => !outlined.includes(n));
if (unknownFilled.length) fail(`name in the "filled" list is missing from "outlined": ${unknownFilled.join(', ')}`);

async function path(file) {
  const res = await fetch(`${BASE}/${file}.svg`);
  if (!res.ok) fail(`could not fetch ${file}.svg (${res.status}) — does the name exist in Material Symbols?`);
  const svg = await res.text();
  const ds = [...svg.matchAll(/\sd="([^"]+)"/g)].map(m => m[1]);
  if (!ds.length) fail(`no path in ${file}.svg`);
  return ds.join('');
}

function fail(msg) {
  console.error(`generate-icons: ${msg}`);
  process.exit(1);
}

const entries = async (names, suffix) =>
  (await Promise.all(names.map(async n => [n, await path(n + suffix)])))
    .map(([n, d]) => `  ${/^[a-z_]\w*$/.test(n) ? n : `'${n}'`}: '${d}',`)
    .join('\n');

const out = `// AUTO-GENERATED — do not edit by hand. Source: icons.manifest.json, command: \`npm run icons\`.
// Material Symbols Outlined (wght 500, opsz 48) · @material-symbols/svg-500@${VERSION} · Apache-2.0
// viewBox "0 -960 960 960"

export const ICONS = {
${await entries(outlined, '')}
} as const;

export type IconName = keyof typeof ICONS;

/** Filled (FILL=1) variant — only those marked as "filled" in the manifest. */
export const ICONS_FILLED: Partial<Record<IconName, string>> = {
${await entries(filled, '-fill')}
};
`;

await writeFile(resolve(dir, 'icons.generated.ts'), out);
console.log(`generate-icons: wrote ${outlined.length} icons, ${filled.length} filled variants.`);
