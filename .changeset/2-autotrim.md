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

To extend the default tags list, this plugin now provides a 2 placeholder values for your array of tags, `@vento` and `@11ty`. When the plugin executes, `@vento` will be expanded to the default vento tags list, and `@11ty` will be expanded to the names of all paired shortcodes.

```js
eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: ['@vento', '@11ty', 'tag1', 'tag2'],
});
```

Setting `autotrim: true` is the same as `autotrim: ['@vento', '@11ty']`.
