---
'eleventy-plugin-vento': patch
---

Refactored the following features internally:

- Reverts 2c3548c1 for modularity: The compatibility check has moved back to `modules/utils.js`
- Revises caching further: Instead of deferring to Vento for everything, permalink templates and templates loaded by Vento (like includes) are cached by Vento. Everything else is cached by Eleventy.
- Rename some internal variables to help with readability (`_11ty.ctx => _11Ctx`)
- `DEBUG` key `Eleventy:Vento:Template` renamed to `Eleventy:Vento:Render`
- Declare engine functions separately and return as an object after everything has been declared.
