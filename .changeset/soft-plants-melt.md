---
'eleventy-plugin-vento': minor
---

Further caching improvements to e8111234 and e46ce6ea. Eleventy now defers all template caching to Vento.

Templates are now compiled directly instead of using Vento's `.runString` method which reduces overhead and enables this plugin to manage the Vento cache in a more direct manner.
