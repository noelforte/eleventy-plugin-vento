---
'eleventy-plugin-vento': patch
---

Partially reverts e46ce6ea, refine caching logic. Pre-compile, the plugin checks the Vento cache to see what source needs compiling and if that matches what was already compiled. If not, then the cache is cleared so Vento can recompile.
