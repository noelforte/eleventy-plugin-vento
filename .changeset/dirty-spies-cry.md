---
'eleventy-plugin-vento': minor
---

Separate `shortcodes` and `pairedShortcodes` into seperate object namespaces. Prior to this version, Eleventy shortcodes and paired shortcodes were merged into a single object keyed as `_11ty.functions` which allowed for naming collisions between shortcodes and their paired counterparts.
