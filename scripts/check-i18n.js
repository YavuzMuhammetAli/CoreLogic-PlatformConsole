/**
 * Çeviri sözlüğü bütünlük denetimi — `npm run check:i18n`.
 *
 * NEDEN SCRIPT, SPEC DEĞİL: Bu projede Karma/Jasmine kurulu değildir
 * (angular.json'da `test` target'ı, package.json'da jasmine bağımlılığı yok).
 * Tek bir doğrulama için tüm test altyapısını kurmak yerine, zaten var olan
 * `typescript` paketiyle kaynakları derleyip denetimi burada koşuyoruz.
 *
 * NE YAKALAR: Eksik bir anahtar sessizce patlamaz — `LanguageService.t()`
 * bulamadığı anahtarı OLDUĞU GİBİ döndürür, yani kullanıcı ekranda
 * `pc.help.plans.title` gibi ham metin görür. Bu script o hatayı CI'a çeker.
 */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

const SRC = path.join(__dirname, '..', 'src');

/** Bir .ts dosyasını CommonJS'e çevirip değerlendirir (tip-only import'lar silinir). */
function loadTs(file) {
  const code = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file
  }).outputText;

  const mod = new Module(file, null);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  // Kardeş .ts dosyalarını da aynı yolla çözebilmek için require'ı sarmala.
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

// ── 1) TR/EN dolu mu? ────────────────────────────────────────────────────────
for (const [key, value] of entries) {
  if (!value || !String(value.tr || '').trim() || !String(value.en || '').trim()) {
    problems.push(`TR/EN eksik: ${key}`);
  }
}

// ── 2) Yer tutucular iki dilde de aynı mı? ───────────────────────────────────
const placeholders = s => (String(s).match(/\{[a-zA-Z0-9_]+\}/g) || []).sort().join(',');
for (const [key, value] of entries) {
  if (placeholders(value.tr) !== placeholders(value.en)) {
    problems.push(`Yer tutucu uyuşmuyor: ${key} (tr: ${placeholders(value.tr) || '—'}, en: ${placeholders(value.en) || '—'})`);
  }
}

// ── 3) Anahtar ön eki ────────────────────────────────────────────────────────
for (const [key] of entries) {
  if (!key.startsWith('pc.')) problems.push(`'pc.' ön eki yok: ${key}`);
}

// ── 4) Yardım konularının her anahtarı sözlükte var mı? ──────────────────────
const keysOf = t => [
  t.titleKey,
  t.summaryKey,
  ...t.fields.flatMap(f => [f.labelKey, f.descKey]),
  ...(t.rules || []).flatMap(r => [r.labelKey, r.descKey]),
  ...(t.notesKey ? [t.notesKey] : [])
];

for (const [id, topic] of Object.entries(PAGE_HELP)) {
  if (topic.fields.length === 0) problems.push(`Alan sözlüğü boş konu: ${id}`);
  for (const key of keysOf(topic)) {
    if (!TRANSLATIONS[key]) problems.push(`Sözlükte yok: ${id} → ${key}`);
  }
}
for (const key of keysOf(FALLBACK_TOPIC)) {
  if (!TRANSLATIONS[key]) problems.push(`Sözlükte yok (fallback): ${key}`);
}

// ── Sonuç ────────────────────────────────────────────────────────────────────
if (problems.length) {
  console.error(`\n✖ ${problems.length} sorun bulundu:\n`);
  problems.forEach(p => console.error('  ' + p));
  console.error('');
  process.exit(1);
}

console.log(
  `✔ i18n bütünlük denetimi geçti — ${entries.length} anahtar, ` +
  `${Object.keys(PAGE_HELP).length} yardım konusu.`
);
