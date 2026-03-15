---
'eleventy-plugin-vento': patch
---

Refactor render function declaration

- Replaced `getTemplateFunction` with `getRenderFunction`
- New method now returns the render function signature Eleventy expects with all error handling logic built in, eliminating the need for a separate render function handler
