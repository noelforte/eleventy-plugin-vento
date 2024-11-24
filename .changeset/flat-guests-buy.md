---
'eleventy-plugin-vento': minor
---

Expose Vento's own `FilterThis` context on Eleventy-declared filters (fixes #72)

Vento binds its own `this` context when executing filter functions. The `this` object contains 2 keys, `this.env` and `this.data`, for getting access to both the Vento environment and the template data.

This release binds Vento's `FilterThis` on filters declared from Eleventy in addition to `this.page` and `this.eleventy` that Eleventy supplies. With this change, you can now create filters that leverage the Vento environment, for instance, to compile dynamic data:

```js
eleventyConfig.addFilter('vento', function (content) {
  const res = this.env.runString(content, this.data);
  return res.content;
});
```

Because re-compilation introduces some overhead, you may want to cache your template strings compiled via a filter. With access to `this.env` you can use Vento's own cache:

```js
import 'hash' from 'node:crypto'; // since Node v20.12.0

const sha1Hash(str) => hash('sha1', str, 'hex');

eleventyConfig.addFilter('vento', function (content) {
  const file = `dynamicString:${sha1Hash(content)}`;
  const res = this.env.runString(content, this.data, file);
  return res.content;
});
```
