<div style="display:flex;gap:2em;justify-content:center;">
<svg width="75" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 32 32"><rect width="32" height="32" fill="#222"/><path fill="#fff" d="M13.2 7.2c0 0-.1 0-.2 0l-2.9.7c-.2 0-.3.1-.4.3 0 .1 0 .3 0 .5v1.1c0 .3 0 .5.2.7 0 0 .2.1.3.1h0s.7-.2.7-.2h0v12.1c0 .3 0 .5 0 .7 0 .1 0 .2.2.3 0 0 .2.1.3.1h1.7c.1 0 .2 0 .3-.1 0 0 .1-.1.2-.3 0-.2 0-.4 0-.7V8c0-.2 0-.4 0-.5 0-.2-.2-.3-.4-.3ZM7.7 7.2c0 0-.1 0-.2 0l-2.9.7c-.2 0-.3.1-.4.3 0 .1 0 .3 0 .5v1.1c0 .3 0 .5.2.7 0 0 .2.1.3.1h0s.7-.2.7-.2h0v12.1c0 .3 0 .5 0 .7 0 .1 0 .2.2.3 0 0 .2.1.3.1h1.7c.1 0 .2 0 .3-.1 0 0 .1-.1.2-.3 0-.2 0-.4 0-.7V8c0-.2 0-.4 0-.5 0-.2-.2-.3-.4-.3ZM20.1 21.4h-.8c-.1 0-.2 0-.3 0h0s-.1 0-.2-.2c0 0-.1-.2-.2-.5 0-.3 0-.6 0-1v-5.6h1.2c.2 0 .4-.1.5-.3 0-.1.1-.3.1-.5v-.6c0-.2 0-.4-.1-.5 0-.2-.3-.3-.5-.3h-1.2s0 0 0 0v-4.3c0-.2 0-.4 0-.6 0-.2-.3-.3-.5-.3h-1.1c-.1 0-.2 0-.3 0 0 0-.1.1-.2.2 0 .1-.1.3-.1.5h0s-.2 4.3-.2 4.3h0s0 0 0 0h-.5c-.2 0-.4.1-.5.3 0 .1-.1.3-.1.5v.6c0 .2 0 .4.1.5 0 .2.3.3.5.3h.5v5.6c0 .6 0 1.2.1 1.7.1.5.2.9.4 1.1.2.3.4.5.7.7.3.2.5.3.8.3.2 0 .5 0 .8 0h1.1c.2 0 .4 0 .5-.2 0-.1.1-.3.1-.5v-.7c0-.2 0-.4-.1-.5-.1-.1-.3-.2-.5-.2ZM27.7 12.1c0 0 0-.1-.1-.2 0 0-.2 0-.3 0h-.9c-.2 0-.3 0-.5.2 0 .1-.2.3-.2.6l-.9 6.1-1.2-6.2c0-.3-.1-.5-.2-.6-.1-.1-.3-.2-.5-.2h-1.3c0 0-.2 0-.3 0 0 0-.1.1-.1.2 0 .1 0 .2 0 .4s0 .2 0 .3h0s2.2 9 2.2 9c.2.9.2 1.1.2 1.2 0 .5 0 .8-.2 1.1 0 .2-.2.2-.2.2 0 0 0 0-.4-.1h0c-.4-.1-.4-.1-.5-.1-.1 0-.2 0-.3.1 0 0-.1.2-.1.3 0 .2 0 .4 0 .7s0 .6.1.7c.1.2.3.4.6.4.2 0 .5.1.9.1h.1s0 0 0 0c.4 0 .7-.1 1-.3h0s0 0 0 0c.3-.2.5-.5.7-1 .2-.5.4-1.1.5-2l2-10.2h0s0 0 0 0c0-.1 0-.2 0-.3 0-.2 0-.3 0-.4Z" /></svg>
<svg width="75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32"><path fill="#00AAFF" d="M0 0H11L25 32H15L0 0Z"/><path fill="#FF0080" d="M21 0H32L25 32H15L21 0Z"/><path fill="#000080" d="M18 16L25 32H15L18 16Z"/></svg>

</div>

# eleventy-plugin-vento 🌬️🎈🐀

An [Eleventy](https://11ty.dev/) plugin that adds support for [Vento](https://vento.js.org/) templates to Eleventy.

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
