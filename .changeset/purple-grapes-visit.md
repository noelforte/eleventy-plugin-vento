---
'eleventy-plugin-vento': patch
---

Integrate eleventy and vento caching.

There have been a few issues around managing Vento's cache that have yielded uninteded results when compiling templates (ie #10, #34). This update integrates Vento's cache with Eleventy's custom extension API.

This means that whether running Eleventy in `--serve` mode or compiling dynamic permalinks, stale cache data actually gets removed so Vento can compile the template from source again.

Raise any issues if caching behavior continues to be an issue!
