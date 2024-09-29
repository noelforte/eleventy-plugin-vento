---
'eleventy-plugin-vento': patch
---

Various Refactors - These changes shouldn't have any observable effect on your templates or usage.

- Replaced `class` based approach for a closure implementation instead. Since there was only 1 Vento `env` object ever instanced in this plugin, steering away from using `class` removes some complexity and overhead.

- `DATA_KEYS` (used internally) moved into utils file alongside other utilities (like compatibility checks) and renamed to `CONTEXT_DATA_KEYS`.

- Moved internal Vento/11ty data from env.\_11ty => env.utils.\_11ty. Previous versions mutated the Vento `env` object by adding an `_11ty` key with everything that needed accessing from within a template compile (shortcodes, filters, etc.). This was moved this back to `env.utils._11ty` since it's probably a more appropriate place to store these functions.
