---
'eleventy-plugin-vento': minor
---

Rewrite project in Typescript and add a build/packaging step for releases and testing.

These changes also include `.d.ts` generation as part of the build step. If you're using `11ty.ts`'s `defineConfig` function, it will pick the types from this plugin up automatically. (resolves #22)
