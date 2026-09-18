#!/usr/bin/env node
/**
 * Validates the extension assets and compiles the TextMate grammar to catch
 * syntax errors and invalid regular expressions before they reach CI/VS Code.
 *
 * Steps:
 *   1. Parse every JSON file (throws on malformed JSON).
 *   2. Assert required fields are present and consistent.
 *   3. Compile the grammar with vscode-textmate (throws on invalid regex /
 *      malformed begin/end rules).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));

const read = (rel) => readFileSync(join(root, rel), 'utf8');

// 1. Malformed JSON detection.
const jsonFiles = [
  'package.json',
  'blade.configuration.json',
  'syntaxes/blade.tmLanguage.json',
];
for (const rel of jsonFiles) {
  JSON.parse(read(rel));
  console.log(`\u2713 valid JSON   ${rel}`);
}

// 2. Required fields / consistency.
const pkg = JSON.parse(read('package.json'));
for (const key of ['name', 'version', 'publisher', 'engines', 'contributes']) {
  if (!(key in pkg)) throw new Error(`package.json is missing "${key}"`);
}

const grammar = JSON.parse(read('syntaxes/blade.tmLanguage.json'));
for (const key of ['scopeName', 'name', 'patterns', 'repository']) {
  if (!(key in grammar)) throw new Error(`grammar is missing "${key}"`);
}

const contributedScope = pkg.contributes.grammars[0]?.scopeName;
if (grammar.scopeName !== contributedScope) {
  throw new Error(
    `grammar scopeName "${grammar.scopeName}" does not match package.json "${contributedScope}"`,
  );
}
console.log('\u2713 structure OK');

// 3. Compile the grammar (catches invalid regex in begin/end/match rules).
const { Registry, parseRawGrammar, INITIAL } = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');

const onigLib = oniguruma
  .loadWASM(readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm')))
  .then(() => ({
    createOnigScanner: (patterns) => new oniguruma.OnigScanner(patterns),
    createOnigString: (str) => new oniguruma.OnigString(str),
  }));

const rawGrammar = read('syntaxes/blade.tmLanguage.json');

const registry = new Registry({
  onigLib,
  // Provide our own grammar so its rules are compiled; external includes
  // (source.php, text.html.basic#attribute, ...) resolve to null, which is
  // tolerated and simply skips those foreign rules during the compile check.
  loadGrammar: async (scopeName) =>
    scopeName === grammar.scopeName
      ? parseRawGrammar(rawGrammar, 'blade.tmLanguage.json')
      : null,
});

const compiled = await registry.loadGrammar(grammar.scopeName);

// Force compilation of every top-level rule (invalid regular expressions in
// begin/end/match rules only surface during tokenization, not on load).
compiled.tokenizeLine('@if($ok)<x-alert type="danger">{{ $name }}</x-alert>@endif', INITIAL);
console.log('\u2713 grammar compiles');
