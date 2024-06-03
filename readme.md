# eleventy-plugin-vento 🌬️🎈🐀

An [Eleventy](https://11ty.dev/) plugin that adds support for [Vento](https://vento.js.org/) templates.

[Installing](#installing)<br>
[Usage](#usage)<br>
[Plugin Options](#plugin-options)<br>
[Vento Filters](#vento-filters)<br>
[Vento Plugins](#vento-plugins)<br>
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
    // A set of filters to load into Vento
    filters: {},

    // An array of Vento plugins to load
    plugins: [],

    // Define whether Javascript Functions should be added
    // to page data. See below for usage notes on this.
    addHelpers: true

    // A Vento configuration object
    ventoOptions: {
      includes: '...', // defaults to the Eleventy 'includes' directory
      autoescape: false,
    },
  });

}
```

View the [full list of options](https://vento.js.org/configuration/#options/) to pass as a Vento Configuration object (as `ventoOptions`).

## Vento Filters

Set the `filters` property to an object with methods, these will be loaded as filters into Vento when Eleventy is run. Note that this feature exists **separately** from the concept of filters in Eleventy ([which are optionally accessible as data in Vento templates]()).

Here's an example of defining an `italicize` filter like the example in the Vento documentation:

```js
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin, {
    filters: {
      italicize(text) {
        return `<em>${text}</em>`;
      },
    },
  });
}
```

And now we can use our filter in a template:

```hbs
<p>The title of my page is: "{{ title |> italicize }}"</p>
```

See https://vento.js.org/configuration/#filters for more information about filters and how they work.

## Vento Plugins

If you'd like to extend the Vento library with any plugins, include them in an array passed to the `plugins` option. Here's an example loading the [auto trim](https://vento.js.org/plugins/auto-trim/) plugin:

```js
import { VentoPlugin } from 'eleventy-plugin-vento';
import autoTrim, { defaultTags } from 'ventojs/plugins/autotrim_plugin.js';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin, {
    plugins: [
      autoTrim({
        tags: ['tag', ...defaultTags],
      }),
    ],
  });
}
```

## JavaScript Helpers

Vento can [run arbitrary JavaScript](https://vento.js.org/syntax/javascript/) in templates through its `{{> ...}}` operator, which evaluates at the time the template is run. However, you may want to use Eleventy Shortcodes and Filters in your templates as well.

By setting `addHelpers` in the plugin options (defaults to `true`), all JavaScript functions (which includes any Universal Filters and Shortcodes) are exposed as functions in page data. This feature functions very similarly to WebC's ["helper functions"](https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions) feature.

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
