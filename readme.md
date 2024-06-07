# eleventy-plugin-vento 🌬️🎈🐀

An [Eleventy](https://11ty.dev/) plugin that adds support for [Vento](https://vento.js.org/) templates.

[Installing](#installing)<br>
[Usage](#usage)<br>
[Plugin Options](#plugin-options)<br>
[Filters](#filters)<br>
[Vento Plugins](#vento-plugins)<br>
[Auto-Trimming Tags](#auto-trimming-tags)<br>
[JavaScript Helpers](#javascript-helpers)<br>

## Installing

```sh
npm install eleventy-plugin-vento
```

## Usage

This plugin is ESM only and cannot be required from CommonJS. As such, it's best used with Eleventy v3.0.0.

If you're using CommonJS and loading it asynchronously (ie `await import`), you will need at minimum Eleventy v1.0.0 which added support for [Custom Templates](https://www.11ty.dev/docs/languages/custom/).

In your Eleventy config:

```js
import { VentoPlugin } from 'eleventy-plugin-vento';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin);
}
```

## Plugin Options

This plugin ships with default options out of the box, but you can [pass an options object](https://www.11ty.dev/docs/plugins/#plugin-configuration-options) to your `addPlugin` call to configure things further. The below example shows the configurable options as well as their defaults.

```js
import { VentoPlugin } from 'eleventy-plugin-vento';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin, {
    // An array of Vento plugins to load
    plugins: [],

    // Define whether Javascript Functions should be added
    // to page data. See below for usage notes on this.
    addHelpers: true,

    // Define tags that should be trimmed, or set to true
    // to trim the default tags (see section on Auto-trimming)
    trimTags: [],

    // A Vento configuration object
    ventoOptions: {
      includes: '...', // defaults to the Eleventy 'includes' directory
      autoescape: false,
    },
  });
}
```

View the [full list of options](https://vento.js.org/configuration/#options/) to pass as a Vento Configuration object (as `ventoOptions`).

## Filters

Filters that are added using Eleventy's `.addFilter()` or `.addAsyncFilter()` methods will be automatically loaded into Vento. Since Vento filters and Eleventy filters follow the same syntax for filters (content as first argument), the implementation is 1:1.

[More information about Vento filters](https://vento.js.org/configuration/#filters)

[More information about Eleventy filters](https://www.11ty.dev/docs/filters/)

## Vento Plugins

If you'd like to extend the Vento library with any plugins, include them in an array passed to the `plugins` option.

```js
import { VentoPlugin } from 'eleventy-plugin-vento';

function myCustomPlugin() {
  // ...plugin code...
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin, {
    plugins: [myCustomPlugin()],
  });
}
```

## Auto-Trimming Tags

One exception to Vento plugins is the `autoTrim` plugin which is bundled with Vento, and by extension, this plugin. This plugin provides a convenient way to control whitespace in the output by collapsing spaces left behind when Vento's tags are removed.

To trim the default tags, set the `trimTags` plugin option to `true`.

```js
eleventyConfig.addPlugin(VentoPlugin, {
  trimTags: true,
});
```

The default set of tags that are trimmed are defined by Vento and are listed in the [usage notes](https://vento.js.org/plugins/auto-trim/#usage) for the auto trim plugin. To set your own tags, set `trimTags` to an array instead.

```js
eleventyConfig.addPlugin(VentoPlugin, {
  trimTags: ['set', 'if', 'for'],
});
```

If instead, you'd like to extend instead of replace the default tag list, `eleventy-plugin-vento` reexports the `defaultTags` array used by as `ventoDefaultTrimTags`, which can be used like so:

```js
import { VentoPlugin, ventoDefaultTrimTags } from 'eleventy-plugin-vento';

eleventyConfig.addPlugin(VentoPlugin, {
  trimTags: [...ventoDefaultTrimTags, 'tag'],
});
```

For more information on the auto-trim plugin, consult the [plugin documentation](https://vento.js.org/plugins/auto-trim/).

## JavaScript Helpers

Vento can [run arbitrary JavaScript](https://vento.js.org/syntax/javascript/) in templates through its `{{> ...}}` operator, which evaluates at the time the template is run. However, you may want to use Eleventy Shortcodes and Filters in your templates as well.

By setting `addHelpers` in the plugin options (defaults to `true`), all JavaScript functions (which includes any Universal Shortcodes) are exposed as functions in page data. This feature functions very similarly to WebC's ["helper functions"](https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions) feature.

As an example:

```js
export default function (eleventyConfig) {
  // via Universal Filter...
  eleventyConfig.addFilter('italicize', (content) => `<em>${content}</em>`);

  // ...or via Universal Shortcode
  eleventyConfig.addShortcode('greeting', (name) => `My name is ${name}`);

  // ...or via JavaScript Template Function
  eleventyConfig.addJavaScriptFunction('possumPosse', () => 'Release the possums!!!');
}
```

```hbs
<p>This is something {{ italicize('really') }} important.</p>
<p>{{ possumPosse() }}</p>

<!-- renders as: -->

<p>This is something <em>really</em> important.</p>
<p>Release the possums!!!</p>

```

Alternatively, if you'd rather keep functions namespaced in your page data, pass a string to `addHelpers`. Your functions will be namespaced under this property name in page data.

```js
addPlugin(VentoPlugin, { addHelpers: 'functions' });
```

```hbs
<!-- With the above, this: -->
<p>This is something {{ italicize('really') }} important.</p>
<p>{{ possumPosse() }}</p>

<!-- should be written as: -->
<p>This is something {{ functions.italicize('really') }} important.</p>
<p>{{ functions.possumPosse() }}</p>
```

Finally, if you'd like to disable populating helper functions at all, set `addHelpers` to false:

```js
eleventyConfig.addPlugin(VentoPlugin, {
  addHelpers: false,
});
```
