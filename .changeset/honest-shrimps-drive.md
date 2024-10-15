---
'eleventy-plugin-vento': patch
---

Refine caching logic so that pre-compile, the plugin checks the Vento cache to see what source needs compiling and if that matches what was already compiled. If not, then the cache is cleared so Vento can recompile.
