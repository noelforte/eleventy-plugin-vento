---
'eleventy-plugin-vento': major
---

Modifications to `auto_trim` functionality

Starting with this release the way the `auto_trim` plugin is implemented is a bit different.

The plugin option `trimTags` is now `autotrim`. Be sure to update your plugin options object accordingly:

```diff
eleventyConfig.addPlugin(VentoPlugin, {
- trimTags: true
+ autotrim: true
});
```

Additionally, the eleventy plugin no longer re-exports `defaultTags` from `ventojs`. Be sure to remove any imports from your config:

```diff
- import { ventoDefaultTrimTags } from 'eleventy-plugin-vento';
```

To extend the default tags list, this plugin now provides a new way to declare a configuration for the `auto_trim` plugin in the form of an object like so:

```js
eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: {
    tags: string[], // tags you'd like to trim
    extend: boolean, // whether to extend or replace the default tags
  }
});
```
