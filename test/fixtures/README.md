# Vendored grammar fixtures

These TextMate grammars are vendored from [`microsoft/vscode`](https://github.com/microsoft/vscode)
(MIT license) so the regression test can tokenize `.blade.php` content exactly the
way real VS Code does, without a network dependency.

| File                          | scopeName             | Source path (microsoft/vscode, `main`)                       |
| ----------------------------- | --------------------- | ------------------------------------------------------------ |
| `html.tmLanguage.json`        | `text.html.basic`     | `extensions/html/syntaxes/html.tmLanguage.json`              |
| `html-derivative.tmLanguage.json` | `text.html.derivative` | `extensions/html/syntaxes/html-derivative.tmLanguage.json` |
| `php-html.tmLanguage.json`    | `text.html.php`       | `extensions/php/syntaxes/html.tmLanguage.json`               |
| `php.tmLanguage.json`         | `source.php`          | `extensions/php/syntaxes/php.tmLanguage.json`                |
| `javascript.tmLanguage.json`  | `source.js`           | `extensions/javascript/syntaxes/JavaScript.tmLanguage.json`  |

The MIT copyright notice for these files is retained in the upstream repository;
this project's own `LICENSE` (MIT) covers the extension, and the grammars remain
copyright their original authors (Microsoft and contributors).
