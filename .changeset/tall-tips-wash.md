---
'eleventy-plugin-vento': minor
---

Permalink compilation optimizations:

- Permalinks now short-circuit to raw strings if they don't contain Vento template syntax, avoiding compilation entirely.
- Permalinks are now assigned (fake) pathnames in Vento's cache. If you change template content but don't change a dynamic permalink in development, Vento will reuse the compiled permalink template. Note that **any** modifications to a template file will **always** cause it to be recompiled (see 19c352fa) — this improvement just optimizes recompiling dynamic permalinks that haven't changed.
