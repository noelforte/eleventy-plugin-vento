---
'eleventy-plugin-vento': patch
---

Refactored files and functions internally that shouldn't have any impact on usage or performance:

- Split `debug` functions into separate exports, renamed `runCompatiblityCheck -> compatibilityCheck` (dd4c379b)
- Utilities are now split into separate files (e06a83ab)
- Main file renamed from `index.ts` to `plugin.ts` (1b122d2a)
