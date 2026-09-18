# Change Log

All notable changes to the "blade-php" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-09-18

### Added
- Syntax highlighting for Blade components, distinct from plain HTML elements:
  - `<x-component>`, `<x-component />` (self-closing), `</x-component>` closing tags
  - `<x-slot>` / `<x-slot:name>` named slots
  - Namespaced components (`<x-mail::message>`, `<x-forms.input>`)
- Highlighting for additional Blade directives: `@canany`, `@context`, `@elsecanany`,
  `@includeIsolated`, `@endcanany`, `@endcontext`, `@pushOnce`, `@pushIf`,
  `@prependOnce`, `@endPushOnce`, `@endPushIf`, `@endPrependOnce`, `@class`, `@aware`,
  `@js`, `@checked`, `@selected`, `@disabled`, `@style`, `@readonly`, `@required`,
  `@use`, `@vite`, `@session`.

## [0.2.1] - 2023-02-23

- Fix language configuration file (comment style).

## [0.1.10] - 2021-03-20

- Initial public release.
