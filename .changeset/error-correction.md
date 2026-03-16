---
'eleventy-plugin-vento': patch
---

Revise error creation method to explicitly check for `undefined` in `ctx.position` and `ctx.file` as opposed to coercing to booleans. This resolves edge cases where errors thrown with a position of `0` would incorrectly log position warnings.
