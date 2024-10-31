---
'eleventy-plugin-vento': major
---

Removed ignore tag `{{! ... }}` syntax. As mentioned in the 3.3.0 release notes, the now preferred way to "pass through" tags is with string literals.

You should update code with `{{! ... }}` to be `{{ '{{ }}' }}` like so:

```diff
- {{! if condition }}
+ {{ '{{ if condition }}' }}
    do something
- {{! /if }}
- {{ '{{ /if }}' }}
```

While more verbose, this change ensures that there isn't any ambiguity between a tag that needs ignoring and JS negation expressions.
