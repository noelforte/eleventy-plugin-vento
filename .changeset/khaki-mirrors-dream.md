---
'eleventy-plugin-vento': patch
---

Select type updates (shouldn't affect compilation, however should improve DX)

Changes are:

- split types into separate files
- namespace `ventojs` type imports
- make `PluginOptions` optional by default
- make Eleventy types more readable
- declare a special (`EleventyVentoEnvironment`) for this plugin to replace Vento's own `Environment`
