---
'eleventy-plugin-vento': minor
---

Expose Vento's `FilterThis` on Eleventy-declared filters. (fixes #72)

> [!IMPORTANT]
> Using this feature incurs the same performance regression that [`eleventyComputed` template strings](https://www.11ty.dev/docs/data-computed/#using-a-template-string) do. Caching can assist with this, see [README](https://github.com/noelforte/eleventy-plugin-vento/blob/main/readme.md) for more information.

Vento binds its own `this` object when executing filter functions. The `this` object contains 2 keys, `this.env` and `this.data`, for getting access to both the Vento environment and the template data respectively.

In addition to Vento's object, `this.page` and `this.eleventy` are also cloned to the top level from `this.data` to maintain feature-parity with Eleventy.

With this change, you can now create filters that leverage the Vento environment. See [README](https://github.com/noelforte/eleventy-plugin-vento/blob/main/readme.md) for more info.
