# eleventy-plugin-vento 🌬️🎈🐀

<img src="https://img.shields.io/badge/Eleventy-v3_&amp;_later_-333?style=flat-square&logo=eleventy&logoColor=fff&labelColor=333&color=111" alt="Eleventy v3 and later">
<a href="https://github.com/noelforte/eleventy-plugin-vento/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/noelforte/eleventy-plugin-vento/ci.yml?branch=main&style=flat-square&logo=github&logoColor=fff&label=Tests&labelColor=333" alt="Github Actions Status"></a>
<a href="https://npmjs.com/package/eleventy-plugin-vento"><img src="https://img.shields.io/npm/v/eleventy-plugin-vento?style=flat-square&logo=npm&logoColor=fff&labelColor=333" alt="eleventy-plugin-vento on npm"></a>
<a href="https://github.com/changesets/changesets/"><img src="https://img.shields.io/badge/🦋_Changesets-333?style=flat-square" alt="changesets on GitHub"></a>

An [Eleventy](https://11ty.dev/) plugin that adds support for [Vento](https://vento.js.org/) templates.

## Contents

[Installing](#installing)<br>
[Usage](#usage)<br>
[Plugin Options](#plugin-options)<br>
[Filters](#filters)<br>
[Shortcodes (Single & Paired)](#shortcodes-single--paired)<br>
[Vento Plugins](#vento-plugins)<br>
[Auto-Trimming Tags](#auto-trimming-tags)<br>
[Debugging](#debugging)<br>

## Installing

```sh
npm install eleventy-plugin-vento
```

## Usage

This plugin is ESM only and cannot be required from CommonJS.

If you're using CommonJS and loading it asynchronously (ie `await import`), you will need at **minimum** Eleventy v3.0.0-alpha.15 which provides internal methods this plugin uses to retrieve Eleventy features from the config API.

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
    // An array of Vento plugins to use when compiling
    plugins: [],

    // Enable/disable Eleventy Shortcodes, Paired Shortcodes,
    // and Filters in .vto templates
    shortcodes: true,
    pairedShortcodes: true,
    filters: true,

    // Define tags that should be trimmed, or set to true
    // to trim the default tags (see section on Auto-trimming)
    autotrim: false,

    // Enable/disable ignore tag syntax (see section on ignoring tags)
    ignoreTag: false,

    // A Vento configuration object
    ventoOptions: {
      includes: eleventyConfig.directories.includes,
    },
  });
}
```

View the [full list of options](https://vento.js.org/configuration/#options/) to pass as a Vento Configuration object (as `ventoOptions`).

## Filters

> [!NOTE]
> Remember, Vento can pipe any JS data type to any built-in global as the first-argument or any `.prototype` method in addition to declared filters. For instance to print the `eleventy` variable as JSON you could use the following snippet:
>
> ```nunjucks
> {{ eleventy |> JSON.stringify }}
> ```
>
> In these cases, Eleventy filters may not be needed depending on your usage.

Filters that are added via Eleventy's `.addFilter()` or `.addAsyncFilter()` methods will be automatically loaded into Vento. Since Vento filters and Eleventy filters follow the same syntax for filters (content as first argument), the implementation is 1:1.

If you'd prefer to set filters yourself (via a plugin or other method) or prevent Eleventy from loading filters into Vento, set `filters: false` in the plugin options.

### Filters and `this` (_Upcoming in 4.1.0_)

This plugin merges the keys normally expected from `this` with the `FilterThis` object Vento provides to filters. The final bound `this` object for filters is as follows:

```ts
{
  env, // Vento environment
  data, // all template global data
  page, // this.page
  eleventy, // this.eleventy
}
```

This feature enables re-use of the Vento environment this plugin provides, within Eleventy filters. As an example use case, you could create a filter that compiles dynamic data and cache it with Vento's own cache:

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

### Relevant documentation

Vento: See [Filters](https://vento.js.org/configuration/#filters) and [Pipes](https://vento.js.org/syntax/pipes/)

Eleventy: See [Filters](https://www.11ty.dev/docs/filters/)

## Shortcodes (Single & Paired)

> [!NOTE]
> Remember, Vento can print any return value from a Javascript expression, as well as [run arbitrary JavaScript](https://vento.js.org/syntax/javascript/) in templates through its `{{> ...}}` operator. In these cases, shortcodes may not be needed depending on your usage.

Single and Paired Shortcodes added via Eleventy's `.addShortcode()`, `.addAsyncShortcode()`, `.addPairedShortcode()` or `.addAsyncPairedShortcode()` will be automatically loaded into Vento.

When using shortcodes in your templates, write them like any other Vento tag:

```nunjucks
{{ myShortcode }}
```

To pass arguments, add a space and your arguments, comma-separated. Arguments are interpreted as JavaScript so type-safety should be considered (quote strings, use booleans if your shortcode expects them, etc.)

```nunjucks
{{ myShortcode 'arg1', 'arg2' }}
{{ myBooleanShortcode false, false, true }}
{{ myNumberShortcode 10, 20, 0 }}
{{ myObjectShortcode { key1: 'val1', key2: 'val2' } }}
```

For paired shortcodes, the syntax is the same, just add a closing tag. Paired shortcodes also accept arguments and can re-process nested Vento tags (including other shortcodes).

```nunjucks
{{ codeBlock 'css' }} <!-- takes arguments too -->
  a {
    color: red;
  }
{{ /codeBlock }}

{{ blockQuote }}
  To be or not to be, that is the question.
  {{ attribute 'William Shakespeare' }} <!-- you can use vento syntax here too -->
{{ /blockQuote }}
```

If you'd prefer to set shortcodes yourself (via a plugin or other method) or prevent Eleventy from loading shortcodes into Vento, set `shortcodes: false` and/or `pairedShortcodes: false` in the plugin options.

As with filters, `env`, `data`, `page` and `eleventy` are bound to `this` in all shortcode functions when executed by Vento. See the section on [Filters and `this`](#filters-and-this-upcoming-in-410) for more information.

> [!IMPORTANT]
> While it's straightforward to load filters via a Vento plugin that appends filters to the filters object as `env.filters.[filter_name]()`, creating custom tags in Vento is more involved. It's highly advised to keep these two options enabled unless you know what you're doing.

### Relevant Documentation

Eleventy: See [Shortcodes](https://www.11ty.dev/docs/shortcodes/) and the sub-section on [Paired Shortcodes](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes).

## Vento Plugins

_Note: The `auto_trim` plugin that ships with Vento has a specific implementation in the scope of this plugin. See [Auto-Trimming Tags](#auto-trimming-tags) for more details._

If you'd like to extend the Vento library with any plugins, include them in an array passed to the `plugins` option.

```js
import { VentoPlugin } from 'eleventy-plugin-vento';

function myCustomPlugin() {
  // ...plugin code...
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin, {
    plugins: [myCustomPlugin],
  });
}
```

## Auto-Trimming Tags

One exception to Vento plugins is the `autoTrim` plugin which is bundled with Vento, and by extension, this plugin. This plugin provides a convenient way to control whitespace in the output by collapsing spaces left behind when Vento's tags are removed.

To trim space around the default tags and all Eleventy paired shortcodes, set the `autotrim` plugin option to `true`.

```js
eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: true,
});
```

The default set of tags that are trimmed are [defined by Vento itself](https://github.com/ventojs/vento/blob/8c767d45441c2d5a90b6b2b4e33bec56018807d3/plugins/auto_trim.ts#L4-L20). To set your own list of tags, set `autotrim` to an array of tags:

```js
eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: ['set', 'if', 'for'],
});
```

If instead, you'd like to extend instead of replace the default tag list, add the value `@vento` and/or `@11ty`. These placeholders will expand to the Vento default tags and Eleventy paired shortcode tags when the plugin executes.

```js
import { VentoPlugin } from 'eleventy-plugin-vento';

eleventyConfig.addPlugin(VentoPlugin, {
  autotrim: {
    tags: ['@vento', '@11ty', 'tag'],
  },
});
```

### Relevant documentation

Vento: See [Auto Trim Plugin](https://vento.js.org/plugins/auto-trim/).

## Debugging

Like Eleventy, this plugin uses the [`debug`](https://www.npmjs.com/package/debug) package to handle verbose logging. The following `DEBUG` namespaces are implemented:

- `Eleventy:Vento` - Logs initial setup of the plugin, loading features, pre-page compile setup steps (like changing `page` and `eleventy` objects)
- `Eleventy:Vento:Cache` - Logs updates to Vento's own internal cache, which is used in tandem with Eleventy's cache.
- `Eleventy:Vento:Render` - Logs when templates are rendered

Because it is a child of the `Eleventy:` namespace, the following command will include output from this plugin as well:

```sh
$ DEBUG='Eleventy:*' npx @11ty/eleventy
```

Alternatively, use a finer grained namespace to see only the output generated by `eleventy-plugin-vento`.

```sh
$ DEBUG='Eleventy:Vento*' npx @11ty/eleventy
```

```sh
$ DEBUG='Eleventy:Vento:Template' npx @11ty/eleventy
```

### Relevant Documentation

Eleventy: See [Debug Mode](https://www.11ty.dev/docs/debugging/).

Debug: See [`debug` on npm](https://www.npmjs.com/package/debug).
