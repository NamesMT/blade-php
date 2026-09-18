# [Blade Syntax for PHP](https://marketplace.visualstudio.com/items?itemName=namesmt.blade-php)

##### Highly recommend to install: [Blade Color](https://marketplace.visualstudio.com/items?itemName=namesmt.blade-color)
> Unfortunately, Tabnine is recommended for now instead of the amazing Intelephense, as Intelephense doesn't support auto-complete for `Blade` blocks (`{{ }}`) yet


Blade syntax highlight support **for (in) `PHP`**.
> Use with Language Mode: `PHP`, so others `PHP` exts should work ([Intelephense](https://github.com/NamesMT/blade-php/blob/HEAD/vscode:extension/bmewburn.vscode-intelephense-client),...etc)

> Additionally, switch to Language Mode: `Blade` to highlight only `Blade` (and `PHP` inside of Blade) syntaxes

## Screenshot

![TBA](https://github.com/namesmt/blade-php/raw/main/images/screenshot.gif)

## User Settings

TBA

Todo:
* Add keyboard shortcut to switch between PHP and Blade Language Mode
* When [#53885](https://github.com/microsoft/vscode/issues/53885) [#68647](https://github.com/microsoft/vscode/issues/68647) is solved, we can:
    + Enable/Disable the syntax in real-time, as well as a shortcut for it.
* **Your ideas?** (submit an github issue)

## Features

* `Blade` syntax highlight
* `Blade` directives (`@if`, `@foreach`, `@section`, ...) with PHP highlighting inside
* `Blade` components (`<x-component>`, `<x-slot:name>`, self-closing & namespaced) highlighted
  distinctly from plain HTML elements
* *More incoming <3*

## Blade Syntax Highlight

* Injected to PHP Language Mode!, just open any extension of `PHP` file
* Switch language mode to `Blade` (`Ctrl + K, M` or `⌘   K, M`)
    + Will leaves only `Blade` and it's sub-`PHP` codes to be highlighted, useful to debug/nav around large `@blade methods`

## Contact

Files any [issue(s)](https://github.com/NamesMT/blade-php/issues) or mail me: [trungdang6102@gmail.com](mailto:trungdang6102@gmail.com).

## Credits

* Blade language grammar is forked & picked from [onecentlin](https://github.com/onecentlin)
    + Checkout her [Blade](https://marketplace.visualstudio.com/items?itemName=onecentlin.laravel-blade)&[Laravel Snippets](https://marketplace.visualstudio.com/items?itemName=onecentlin.laravel5-snippets)
* Additional credits:
    + https://github.com/jawee/language-blade
    + https://github.com/Medalink/laravel-blade


## Development

* `npm run validate` — JSON + grammar compile check.
* `npm test` — grammar tokenization regression tests.
* Publishing a new version is documented in [RELEASING.md](RELEASING.md).


## License

**MIT**
