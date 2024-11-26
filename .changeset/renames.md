---
'eleventy-plugin-vento': patch
---

Refactored files and functions internally that shouldn't have any impact on usage or performance:

- Split `debug` functions into separate exports, renamed `runCompatiblityCheck -> compatibilityCheck` (dd4c379b)
- Utilities split into separate files (3c32e74f)
- Main file renamed from `index.ts` to `plugin.ts` (8b9eca1d)
