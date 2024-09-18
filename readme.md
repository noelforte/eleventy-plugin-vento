# eleventy-plugin-vento 🌬️🎈🐀

<a href="https://github.com/noelforte/eleventy-plugin-vento/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/noelforte/eleventy-plugin-vento/ci.yml?branch=main&style=flat-square&logo=github&logoColor=fff&label=Tests&labelColor=333" alt="Github Actions Status"></a>
<a href="https://npmjs.com/package/eleventy-plugin-vento"><img src="https://img.shields.io/npm/v/eleventy-plugin-vento?style=flat-square&logo=npm&logoColor=fff&labelColor=333" alt="eleventy-plugin-vento on npm"></a>
<a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/semantic--release-Conventional_Commits-fa6673?style=flat-square&logo=semanticrelease&logoColor=fff&labelColor=333" alt="semantic-release"></a>

An [Eleventy](https://11ty.dev/) plugin that adds support for [Vento](https://vento.js.org/) templates.

## Contents

[Installing](#installing)<br>
[Usage](#usage)<br>
[Plugin Options](#plugin-options)<br>
[Filters](#filters)<br>
[Vento Plugins](#vento-plugins)<br>
[Auto-Trimming Tags](#auto-trimming-tags)<br>
[JavaScript Helpers](#javascript-helpers)<br>
[Ignoring Tags](#ignoring-tags)<br>

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

    // Enable/disable ignore tag syntax (see section on ignoring tags)
    ignoreTag: false,

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

To trim the default tags, set the `autotrim` plugin option to `true`.

```js
eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: true,
});
```

The default set of tags that are trimmed are [defined in Vento](https://github.com/ventojs/vento/blob/8c767d45441c2d5a90b6b2b4e33bec56018807d3/plugins/auto_trim.ts#L4-L20). To set your own tags, set `autotrim` to an object with a `tags` key.

```js
eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: {
    tags: ['set', 'if', 'for'],
  },
});
```

If instead, you'd like to extend instead of replace the default tag list, set `autotrim.extend` to true.

```js
import { VentoPlugin } from 'eleventy-plugin-vento';

eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: {
    tags: ['tag'],
    extend: true,
  },
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

```nunjucks
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

## Ignoring Tags

Exclusive to this plugin is the ability to skip processing a vento tag entirely and instead preserve the tag in the markup. This could be useful if you're doing some hybrid rendering and would like to defer certain tags from being processed until load time, so they can be rendered on the server.

This feature is enabled through use of the `enableIgnoreTag` plugin option.

```js
eleventyConfig.addPlugin(VentoPlugin, {
  enableIgnoreTag: true,
});
```

To skip over a tag, add a `!` directly after the opening tag.

```nunjucks
<!-- This: -->
{{! doSomeServerSideStuff() }}

<!-- Renders as: -->
{{ doSomeServerSideStuff() }}
```

Works with JS expressions too:

```nunjucks
{{!> 2 + 2 }}

<!-- Renders as: -->
{{> 2 + 2 }}
```

The Vento language offers similar functionality via the [`echo` tag](https://vento.js.org/syntax/print/#echo) which works great for blocks, but can be verbose for 1-off tags.

Consider the following:

```nunjucks
{{ echo }}
  <!-- Will be preserved in output -->
  {{ if someCondition }}
    <p>{{ getServerData }}</p>
{{ /echo }}

    <!-- Can't render this without exiting and re-entering echo -->
    <p>Page built on: {{ localBuildTime }}</p>

{{ echo }}
  {{ /if }}
{{ /echo }}
```

Rather than having to do multiple `{{ /echo }} ... {{ echo }}` statements, the previous can be rewritten as such:

```nunjucks
<!-- This: -->
{{! if someCondition }}
  <p>{{! getServerData }}</p>

  <p>Page built on: {{ localBuildTime }}</p>
{{! /if }}

<!-- Renders as: -->
{{ if someCondition }}
  <p>{{ getServerData }}</p>

  <p>Page built on: 04-08-2024</p>
{{ /if }}
```
