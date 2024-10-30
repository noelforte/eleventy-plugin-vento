---
'eleventy-plugin-vento': minor
---

⚠️ DEPRECATION NOTICE: Ignore tag `{{! ... }}` syntax is now deprecated and will be removed in 4.0.0.

This change comes in favor of using string literals to "pass through" tags without rendering them, like so:

```diff
- {{! if condition }}
+ {{ '{{ if condition }}' }}
    do something
- {{! /if }}
- {{ '{{ /if }}' }}
```

While more verbose, this change ensures that there isn't any ambiguity between a tag that needs ignoring and JS negation expressions:

```hbs
<!-- These are functionally equivalent and can lead to collisions in rendering functionality -->

{{! conditionStatementToIgnore }}

{{ !conditionStatementToIgnore }}
```

If an improved syntax for deferred rendering scenarios ever makes its way to Vento, it will be made available in this plugin.
