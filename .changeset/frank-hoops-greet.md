---
'eleventy-plugin-vento': patch
---

Switch to fixed .mjs/.mts extensions for disambiguation of filetypes in package entrypoints.

This behavior is used by `tsdown` (the build system for this project) when the `platform` is set to `node` (the default).
