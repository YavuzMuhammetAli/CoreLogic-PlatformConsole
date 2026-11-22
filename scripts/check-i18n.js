/**
 * Translation dictionary integrity check — `npm run check:i18n`.
 *
 * WHY A SCRIPT, NOT A SPEC: Karma/Jasmine is not installed in this project
 * (no `test` target in angular.json, no jasmine dependency in package.json).
 * Instead of setting up a whole test infrastructure for a single check, we compile
 * the sources with the already present `typescript` package and run the check here.
 *
 * WHAT IT CATCHES: A missing key does not fail loudly — `LanguageService.t()`
 * returns a key it cannot find AS IS, so the user sees raw text like
 * `pc.help.plans.title` on screen. This script pulls that error into CI.
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

const SRC = path.join(__dirname, '..', 'src');

/** Transpiles a .ts file to CommonJS and evaluates it (type-only imports are dropped). */
function loadTs(file) {
  const code = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file
  }).outputText;

  const mod = new Module(file, null);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  // Wrap require so sibling .ts files can be resolved the same way.
  const originalRequire = mod.require.bind(mod);
  mod.require = req => {
    if (req.startsWith('.')) {
      const resolved = path.resolve(path.dirname(file), req);
      const candidate = fs.existsSync(resolved + '.ts') ? resolved + '.ts'
        : fs.existsSync(path.join(resolved, 'index.ts')) ? path.join(resolved, 'index.ts')
        : null;
      if (candidate) return loadTs(candidate);
    }
    return originalRequire(req);
  };
  mod._compile(js, file);
  return mod.exports;
}

const { TRANSLATIONS } = loadTs(path.join(SRC, 'app/i18n/index.ts'));
const { PAGE_HELP, FALLBACK_TOPIC } =
  loadTs(path.join(SRC, 'app/shared/ui/page-help/page-help.data.ts'));

const problems = [];
const entries = Object.entries(TRANSLATIONS);

// ── 1) Are TR/EN filled in? ──────────────────────────────────────────────────
for (const [key, value] of entries) {
  if (!value || !String(value.tr || '').trim() || !String(value.en || '').trim()) {
    problems.push(`Missing TR/EN: ${key}`);
  }
}

// ── 2) Are the placeholders the same in both languages? ──────────────────────
const placeholders = s => (String(s).match(/\{[a-zA-Z0-9_]+\}/g) || []).sort().join(',');
for (const [key, value] of entries) {
  if (placeholders(value.tr) !== placeholders(value.en)) {
    problems.push(`Placeholder mismatch: ${key} (tr: ${placeholders(value.tr) || '—'}, en: ${placeholders(value.en) || '—'})`);
  }
}

// ── 3) Key prefix ────────────────────────────────────────────────────────────
for (const [key] of entries) {
  if (!key.startsWith('pc.')) problems.push(`Missing 'pc.' prefix: ${key}`);
}

// ── 4) Is every key of the help topics in the dictionary? ────────────────────
const keysOf = t => [
  t.titleKey,
  t.summaryKey,
  ...t.fields.flatMap(f => [f.labelKey, f.descKey]),
  ...(t.rules || []).flatMap(r => [r.labelKey, r.descKey]),
  ...(t.notesKey ? [t.notesKey] : [])
];

for (const [id, topic] of Object.entries(PAGE_HELP)) {
  if (topic.fields.length === 0) problems.push(`Topic with empty field glossary: ${id}`);
  for (const key of keysOf(topic)) {
    if (!TRANSLATIONS[key]) problems.push(`Not in dictionary: ${id} → ${key}`);
  }
}
for (const key of keysOf(FALLBACK_TOPIC)) {
  if (!TRANSLATIONS[key]) problems.push(`Not in dictionary (fallback): ${key}`);
}

// ── 5) Do the server constants have display names? ───────────────────────────
// Badges/select boxes translate these values via `pc.enum.*` and `pc.feature.*`;
// without a match the raw English constant shows on screen.
const model = file => loadTs(path.join(SRC, 'app/core/models', file));
const enumSources = {
  JOB_STATUSES: model('job.models.ts').JOB_STATUSES,
  PLAN_STATUSES: model('commerce.models.ts').PLAN_STATUSES,
  SUBSCRIPTION_STATUSES: model('commerce.models.ts').SUBSCRIPTION_STATUSES,
  TENANT_STATUSES: model('tenant.models.ts').TENANT_STATUSES,
  ANNOUNCEMENT_SEVERITIES: model('announcement.models.ts').ANNOUNCEMENT_SEVERITIES,
  FLAG_STATES: model('flag.models.ts').FLAG_STATES,
  COMPLIANCE_TYPES: model('compliance.models.ts').COMPLIANCE_TYPES
};
for (const topic of Object.values(PAGE_HELP)) {
  if (topic.lifecycle) enumSources[`lifecycle(${topic.titleKey})`] = topic.lifecycle;
}
for (const [source, values] of Object.entries(enumSources)) {
  if (!Array.isArray(values)) { problems.push(`Could not read constant: ${source}`); continue; }
  for (const v of values) {
    if (!TRANSLATIONS[`pc.enum.${v}`]) problems.push(`Missing display name: ${source} → pc.enum.${v}`);
  }
}
// Plan feature / metric names are not in the translation dictionary but in the server's MetricCatalog.

// ── Result ───────────────────────────────────────────────────────────────────
if (problems.length) {
  console.error(`\n✖ ${problems.length} problem(s) found:\n`);
  problems.forEach(p => console.error('  ' + p));
  console.error('');
  process.exit(1);
}

console.log(
  `✔ i18n integrity check passed — ${entries.length} keys, ` +
  `${Object.keys(PAGE_HELP).length} help topics.`
);
