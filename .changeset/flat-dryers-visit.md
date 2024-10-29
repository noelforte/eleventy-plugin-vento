---
'eleventy-plugin-vento': minor
---

Further refine caching between Eleventy and Vento: commit ec02a765 deferred **all** caching to Vento and turned off Eleventy's cache (released in 3.1.0). This release allows Vento to cache only the templates that Eleventy can't cache (permalinks, includes, etc.), and Eleventy caches everything else.

A performance oversight has also been resolved by this change. Now, template functions are pre-compiled and saved by Eleventy, only running the template on render without having to go through a re-compile or get a template from the cache.
