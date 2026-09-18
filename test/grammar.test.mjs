#!/usr/bin/env node
/**
 * Regression test for the Blade grammar.
 *
 * Tokenizes representative `.blade.php` snippets using the real VS Code HTML
 * and PHP grammars (vendored in test/fixtures) with the Blade grammar injected,
 * then asserts the expected scopes. This guards against regressions such as a
 * broken `<x-component>` rule or a directive being dropped from a keyword list.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixtures = join(root, 'test', 'fixtures');

const { Registry, parseRawGrammar, INITIAL } = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');

const onigLib = oniguruma
  .loadWASM(readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm')))
  .then(() => ({
    createOnigScanner: (patterns) => new oniguruma.OnigScanner(patterns),
    createOnigString: (str) => new oniguruma.OnigString(str),
  }));

const fixtureFor = {
  'text.html.basic': 'html.tmLanguage.json',
  'text.html.derivative': 'html-derivative.tmLanguage.json',
  'text.html.php': 'php-html.tmLanguage.json',
  'source.php': 'php.tmLanguage.json',
  'source.js': 'javascript.tmLanguage.json',
};

const BLADE_SCOPE = 'source.php.blade';

const registry = new Registry({
  onigLib,
  loadGrammar: async (scopeName) => {
    if (fixtureFor[scopeName]) {
      return parseRawGrammar(
        readFileSync(join(fixtures, fixtureFor[scopeName]), 'utf8'),
        fixtureFor[scopeName],
      );
    }
    if (scopeName === BLADE_SCOPE) {
      return parseRawGrammar(
        readFileSync(join(root, 'syntaxes', 'blade.tmLanguage.json'), 'utf8'),
        'blade.tmLanguage.json',
      );
    }
    return null;
  },
  // Wire the Blade grammar into the PHP/HTML grammar, matching the extension's
  // `injectTo: ["text.html.php"]` contribution.
  getInjections: (scopeName) =>
    scopeName === 'text.html.php' ? [BLADE_SCOPE] : undefined,
});

const grammar = await registry.loadGrammar('text.html.php');

function tokenize(line) {
  return grammar.tokenizeLine(line, INITIAL).tokens;
}

// Returns the scope names of the token covering `needle`; `last` selects the
// last occurrence (useful for closing tags like `</x-alert>`).
function scopesFor(line, needle, last = false) {
  const at = (last ? line.lastIndexOf(needle) : line.indexOf(needle));
  assert.notEqual(at, -1, `"${needle}" not found in ${JSON.stringify(line)}`);
  for (const token of tokenize(line)) {
    if (token.startIndex <= at && token.endIndex >= at + needle.length) {
      return token.scopes;
    }
  }
  assert.fail(`no token covers "${needle}" in ${JSON.stringify(line)}`);
}

// Asserts `needle` carries `scope` (exact match against one token scope).
function assertScope(line, needle, scope, last = false) {
  const scopes = scopesFor(line, needle, last);
  assert.ok(
    scopes.includes(scope),
    `expected "${needle}" in ${JSON.stringify(line)} to have scope "${scope}", got [${scopes.join(', ')}]`,
  );
}

const cases = [
  // Plain HTML stays HTML.
  ['<div class="f">hi</div>', 'div', 'entity.name.tag.html'],
  // Custom elements that are not Blade stay HTML.
  ['<my-widget data-x="1">hi</my-widget>', 'my-widget', 'entity.name.tag.html'],
  // Blade components get the distinct blade scope (opening, closing, self-closing).
  ['<x-alert>hi</x-alert>', 'x-alert', 'entity.name.tag.blade'],
  ['<x-alert>hi</x-alert>', 'x-alert', 'entity.name.tag.blade', true],
  ['<x-alert type="danger" />', 'x-alert', 'entity.name.tag.blade'],
  // Named slots and namespaced components.
  ['<x-slot:title>Title</x-slot:title>', 'x-slot:title', 'entity.name.tag.blade'],
  ['<x-mail::message>hi</x-mail::message>', 'x-mail::message', 'entity.name.tag.blade'],
  ['<x-forms.input value="a" />', 'x-forms.input', 'entity.name.tag.blade'],
];

for (const [line, needle, scope, last] of cases) {
  assertScope(line, needle, scope, last);
}
console.log(`\u2713 ${cases.length} component tag cases`);

// Attributes on components are still parsed as HTML attributes.
{
  const scopes = scopesFor('<x-alert type="danger" />', 'type');
  assert.ok(
    scopes.some((s) => s.startsWith('entity.other.attribute-name')),
    `component attribute name lost HTML scope: [${scopes.join(', ')}]`,
  );
  assert.ok(
    scopes.some((s) => s.startsWith('meta.attribute')),
    `component attribute meta scope lost: [${scopes.join(', ')}]`,
  );
  console.log('\u2713 component attributes keep HTML highlighting');
}

// Directives and interpolation still work.
assertScope('@if($ok) yes @endif', '@if', 'keyword.control.blade');
assertScope('{{ $name }}', '{{', 'support.function.construct.begin.blade');
{
  const scopes = scopesFor('{{ $name }}', 'name');
  assert.ok(scopes.includes('source.php'), `echo content is not source.php: [${scopes.join(', ')}]`);
  console.log('\u2713 directives & interpolation');
}

console.log('\nAll grammar regression assertions passed.');
