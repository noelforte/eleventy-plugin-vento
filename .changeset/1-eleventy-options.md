---
'eleventy-plugin-vento': major
---

Adds complete support for Eleventy shortcodes and filters within Vento. Shortcodes are now loaded by default as Vento tags and will no longer be exposed as functions in your page data.

The implementation of single shortcodes remains largely similar, just replace function-like calls with Vento tags.

```diff
- {{ nametag('Noel', 'Forte') }}
+ {{ nametag 'Noel', 'Forte' }}
```

Of course, the big news is that **paired** shortcodes are now officially supported by this plugin!! Prior to this release, paired shortcodes were exposed just like regular shortcodes, but were plain JS functions. With this release you can now use paired shortcodes just like any other tag.

```hbs
<!-- Before: everything is jammed into the function call :( -->
{{ blockquote("<p>Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</p>\n<p>It is a way I have of driving off the spleen and regulating the circulation.</p>", "Herman Melville", "1851") }}

<!-- After: opening and closing tags with arguments separated :) -->
{{ blockquote 'Herman Melville', '1851' }}
  <p>Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</p>
  <p>It is a way I have of driving off the spleen and regulating the circulation.</p>
{{ /blockquote }}
```

Because these changes removed direct dependence on Eleventy JavaScript functions, the `addHelpers` option has been replaced with 3 new options: `shortcodes`, `pairedShortcodes` and `filters`. **All of them are enabled by default** but can be disabled in your plugin config like so.

```diff
eleventyConfig.addPlugin(VentoPlugin, {
- addHelpers: false,
+ shortcodes: false,
+ pairedShortcodes: false,
+ filters: false,
});
```
