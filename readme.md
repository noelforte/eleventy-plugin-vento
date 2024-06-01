# eleventy-plugin-vento 🌬️🎈🐀

An [Eleventy](https://11ty.dev/) plugin that adds support for [Vento](https://vento.js.org/) templates.

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

## Plugin options

This plugin ships with default options out of the box, but you can [pass an options object](https://www.11ty.dev/docs/plugins/#plugin-configuration-options) to your `addPlugin` call to configure things further.

```js
import { VentoPlugin } from 'eleventy-plugin-vento';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin, {
    /* options... */
  });
}
```

Options are as follows (see below for more information about each):

```js
{
  // Merge global variables into the Data Cascade via `node-retrieve-globals`
  retrieveGlobals: false,

  // An set of filters to load into Vento
  filters: {}

  // A Vento configuration object, defaults shown
  ventoOptions: {
    includes: '...', // defaults to Eleventy include directory
    autoescape: false,
  },
}
```

View the [full list of options](https://vento.js.org/configuration/#options/) to pass as a Vento Configuration object.

## Retrieving Globals

If you'd like any globals you declare in your templates to be merged back into the Data Cascade, set `retrieveGlobals` to `true`. Note that merging into the global scope can have unintended side effects so this option is turned off by default. Front-matter parsing is always enabled.

When enabled, the following templates are all equivalent:

```vento
---
title: 'My Page Title'
layout: 'page-layout.vto'
---

<h1>{{ title }}</h1>
```

```vento
{{ set title = 'My Page Title' }}
{{ set layout = 'page-layout.vto' }}

<h1>{{ title }}</h1>
```

```vento
{{>
  const title = 'My Page Title'
  const layout = 'page-layout.vto'
}}

<h1>{{ title }}</h1>
```

## Defining filters

Set the `filters` property to an object with methods, these will be loaded as filters into Vento when Eleventy is run.

Here's an example of defining an `italicize` filter like the example in the Vento documentation:

```js
{
  filters: {
    italicize(text) {
      return `<em>${text}</em>`
    }
  }
}
```

And now we can use our filter in a template:

```vento
<p>The title of my page is: "{{ title |> italicize }}"</p>
```

See https://vento.js.org/configuration/#filters for more details
