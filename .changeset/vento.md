---
'eleventy-plugin-vento': minor
---

Update Vento to v2.1.0

Vento 2.1.0 adds a [`strict`](https://vento.js.org/configuration/#strict-mode) mode to fail compilation if a variable is undefined. Because this option changes the performance profile of Vento, this plugin keeps it disabled (the default).

If you'd like to enable it, you can do so by setting it in the Vento config key when loading this plugin, like so:

```js
eleventyConfig.addPlugin(VentoPlugin, {
  ventoOptions: {
    strict: true,
  },
});
```

See Vento's ([changelog](https://github.com/ventojs/vento/blob/main/CHANGELOG.md#210---2025-09-17)) for more information.
