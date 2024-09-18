---
'eleventy-plugin-vento': minor
---

Add option to explicitly enable tag ignore syntax.

Prior to this release this feature was referred to as the "SSR" or "hybrid-rendering" syntax. It's purpose was to skip over processing a tag like Vento's built-in `{{ echo }}` tag, but with a much shorter syntax: `{{! ... }}`. Any code following a `!` in your markup is wrapped in `{{ }}` and output as-is.

```hbs
{{!> console.log('Hello world'); }} <!-- tag remains in output -->
```

In this release, this behavior is now explicitly opt-in. To enable it, include `ignoreTag: true` in the plugin options:

```js
eleventyConfig.addPlugin(VentoPlugin, {
  ignoreTag: true,
});
```
