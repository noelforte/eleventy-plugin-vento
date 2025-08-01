# eleventy-plugin-vento

## 4.5.1

### Patch Changes

- 1fbab3a: Update `ventojs` to 1.15.2

## 4.5.0

### Minor Changes

- 1f1a13a: Update ventojs to 1.14.0. This version bump incorporates the following new features:

  - Loading templates via URLs
  - Destructuring in `for` loops
  - `{{ continue }}` and `{{ break }}` tags
  - Pipes in `if`
  - Pipes in `function`

  Be sure to see the [Vento changelog](https://github.com/ventojs/vento/blob/main/CHANGELOG.md#1140---2025-06-12) for more information.

## 4.4.2

### Patch Changes

- e6872ec: Update vento to 1.13.2

## 4.4.1

### Patch Changes

- e6c4262: Update vento to 1.13.1 (fixes #257)

## 4.4.0

### Minor Changes

- b845e27: Update `ventojs` to 1.13.0

## 4.3.0

### Minor Changes

- 8369ae1: Update `debug` to 4.4.1

## 4.2.1

### Patch Changes

- aa931db: handle shortcode names that start with the same sequence (fixes #220)

## 4.2.0

### Minor Changes

- fc6aa07: Update `ventojs` to 1.12.16

### Patch Changes

- 02d75fd: Adjust `nestedVarname` for Eleventy-provided shortcodes so that conflicts in internal template variable names are less likely. Should not have significant impact on builds.
- 12e04fe: Made `DEBUG` messages regarding whether Eleventy or Vento was caching a template more verbose

## 4.1.1

### Patch Changes

- 335f21e: Select type updates (shouldn't affect compilation, however should improve DX)

  Changes are:

  - split types into separate files
  - namespace `ventojs` type imports
  - make `PluginOptions` optional by default
  - make Eleventy types more readable
  - declare a special (`EleventyVentoEnvironment`) for this plugin to replace Vento's own `Environment`

- 070109a: Refactored files and functions internally that shouldn't have any impact on usage or performance:

  - Split `debug` functions into separate exports, renamed `runCompatiblityCheck -> compatibilityCheck` (dd4c379b)
  - Utilities are now split into separate files (e06a83ab)
  - Main file renamed from `index.ts` to `plugin.ts` (1b122d2a)

- c382be0: Wrap all filters as regular synchronous functions to avoid ambiguity with sync and async handling. (fixes #96)

  This change enforces explicit use of the `await` keyword to unwrap returned values from filters before chaining more or printing the result.

  ```diff
  <!-- Single filters -->
  - {{ "Hello, async!" |> someAsyncFilter }}
  + {{ "Hello, async!" |> await someAsyncFilter }}

  <!-- Filter chains -->
  - {{ "Hello, async!" |> someAsyncFilter |> someSyncFilter }}
  + {{ "Hello, async!" |> await someAsyncFilter |> someSyncFilter }}
  ```

  See the [Vento docs on async chains](https://vento.js.org/syntax/pipes/#chain-pipes) for more information.

- 9eaa059: Update `debug` to v4.4.0
- 0b0f96a: Update ventojs to v1.12.14

## 4.1.1-beta.0

### Patch Changes

- 335f21e: Select type updates (shouldn't affect compilation, however should improve DX)

  Changes are:

  - split types into separate files
  - namespace `ventojs` type imports
  - make `PluginOptions` optional by default
  - make Eleventy types more readable
  - declare a special (`EleventyVentoEnvironment`) for this plugin to replace Vento's own `Environment`

- 9eaa059: Update `debug` to v4.4.0
- f387b5e: Update `ventojs` to v1.12.13
- 070109a: Refactored files and functions internally that shouldn't have any impact on usage or performance:

  - Split `debug` functions into separate exports, renamed `runCompatiblityCheck -> compatibilityCheck` (dd4c379b)
  - Utilities are now split into separate files (e06a83ab)
  - Main file renamed from `index.ts` to `plugin.ts` (1b122d2a)

## 4.1.0

### Minor Changes

- eb33d79: Expose Vento's `FilterThis` on Eleventy-declared filters. (fixes #72)

  > [!IMPORTANT]
  > Using this feature incurs the same performance regression that [`eleventyComputed` template strings](https://www.11ty.dev/docs/data-computed/#using-a-template-string) do. Caching can assist with this, see [README](https://github.com/noelforte/eleventy-plugin-vento/blob/main/readme.md) for more information.

  Vento binds its own `this` object when executing filter functions. The `this` object contains 2 keys, `this.env` and `this.data`, for getting access to both the Vento environment and the template data respectively.

  In addition to Vento's object, `this.page` and `this.eleventy` are also cloned to the top level from `this.data` to maintain feature-parity with Eleventy.

  With this change, you can now create filters that leverage the Vento environment. See [README](https://github.com/noelforte/eleventy-plugin-vento/blob/main/readme.md) for more info.

- eb33d79: Update vento to 1.12.12

## 4.0.1

### Patch Changes

- hotfix - include `types` field in package.json to declare bundled types

## 4.0.0

### Major Changes

- fc80b5f: Removed ignore tag `{{! ... }}` syntax. As mentioned in the 3.3.0 release notes, the now preferred way to "pass through" tags is with string literals.

  You should update code with `{{! ... }}` to be `{{ '{{ }}' }}` like so:

  ```diff
  - {{! if condition }}
  + {{ '{{ if condition }}' }}
      do something
  - {{! /if }}
  - {{ '{{ /if }}' }}
  ```

  While more verbose, this change ensures that there isn't any ambiguity between a tag that needs ignoring and JS negation expressions.

### Minor Changes

- 2b5f337: Rewrite project in Typescript and add a build/packaging step for releases and testing.

  These changes also include `.d.ts` generation as part of the build step. If you're using `11ty.ts`'s `defineConfig` function, it will pick the types from this plugin up automatically. (resolves #22)

## 4.0.0-beta.0

### Major Changes

- fc80b5f: Removed ignore tag `{{! ... }}` syntax. As mentioned in the 3.3.0 release notes, the now preferred way to "pass through" tags is with string literals.

  You should update code with `{{! ... }}` to be `{{ '{{ }}' }}` like so:

  ```diff
  - {{! if condition }}
  + {{ '{{ if condition }}' }}
      do something
  - {{! /if }}
  + {{ '{{ /if }}' }}
  ```

  While more verbose, this change ensures that there isn't any ambiguity between a tag that needs ignoring and JS negation expressions.

### Minor Changes

- 2b5f337: Rewrite project in Typescript and add a build/packaging step for releases and testing.

  These changes also include `.d.ts` generation as part of the build step. If you're using `11ty.ts`'s `defineConfig` function, it will pick the types from this plugin up automatically. (resolves #22)

## 3.4.0

### Minor Changes

- 8c6b8a2: Update `ventojs` to v1.12.11

## 3.3.0

### Minor Changes

- 387eb48: ⚠️ DEPRECATION NOTICE: Ignore tag `{{! ... }}` syntax is now deprecated and will be removed in 4.0.0.

  This change comes in favor of using string literals to "pass through" tags without rendering them, like so:

  ```diff
  - {{! if condition }}
  + {{ '{{ if condition }}' }}
      do something
  - {{! /if }}
  - {{ '{{ /if }}' }}
  ```

  While more verbose, this change ensures that there isn't any ambiguity between a tag that needs ignoring and JS negation expressions:

  ```vto
  <!-- These are functionally equivalent and can lead to collisions in rendering functionality -->

  {{! conditionStatementToIgnore }}

  {{ !conditionStatementToIgnore }}
  ```

  If an improved syntax for deferred rendering scenarios ever makes its way to Vento, it will be made available in this plugin.

## 3.2.0

### Minor Changes

- f9388e1: Further refine caching between Eleventy and Vento: commit ec02a765 deferred **all** caching to Vento and turned off Eleventy's cache (released in 3.1.0). This release allows Vento to cache only the templates that Eleventy can't cache (permalinks, includes, etc.), and Eleventy caches everything else.

  A performance oversight has also been resolved by this change. Now, template functions are pre-compiled and saved by Eleventy, only running the template on render without having to go through a re-compile or get a template from the cache.

### Patch Changes

- 693e1a2: Refactored the following features internally:

  - Reverts 2c3548c1 for modularity: The compatibility check has moved back to `modules/utils.js`
  - Revises caching further: Instead of deferring to Vento for everything, permalink templates and templates loaded by Vento (like includes) are cached by Vento. Everything else is cached by Eleventy.
  - Rename some internal variables to help with readability (`_11ty.ctx => _11Ctx`)
  - `DEBUG` key `Eleventy:Vento:Template` renamed to `Eleventy:Vento:Render`
  - Declare engine functions separately and return as an object after everything has been declared.

## 3.1.0

### Minor Changes

- 7e6ba68: Separate `shortcodes` and `pairedShortcodes` into seperate object namespaces. Prior to this version, Eleventy shortcodes and paired shortcodes were merged into a single object keyed as `_11ty.functions` which allowed for naming collisions between shortcodes and their paired counterparts.
- b8f0a03: Adds new dependency on `debug` package, to help out with testing and getting more verbose logs. The following `DEBUG` namespaces are implemented:

  - `Eleventy:Vento:Setup` - Logs initial setup of the plugin, loading features, pre-page compile setup steps (like changing `page` and `eleventy` objects)
  - `Eleventy:Vento:Cache` - Logs updates to Vento's own internal cache, which is used in tandem with Eleventy's cache.
  - `Eleventy:Vento:Template` - Logs rendered templates and other template related actions

  Because it is a child of the `Eleventy:` namespace, the following command will include output from this plugin as well:

  ```sh
  $ DEBUG='Eleventy:*' npx @11ty/eleventy
  ```

  Alternatively, use a finer grained namespace to see only the output generated by `eleventy-plugin-vento`.

  ```sh
  $ DEBUG='Eleventy:Vento:*' npx @11ty/eleventy
  ```

  ```sh
  $ DEBUG='Eleventy:Vento:Template' npx @11ty/eleventy
  ```

  See [the docs on 11ty.dev](https://www.11ty.dev/docs/debugging/) as well as the [debug package README](https://github.com/debug-js/debug/blob/master/README.md) for more information.

- ec02a76: Further caching improvements to e8111234 and e46ce6ea. Eleventy now defers all template caching to Vento.

  Templates are now compiled directly instead of using Vento's `.runString` method which reduces overhead and enables this plugin to manage the Vento cache in a more direct manner.

- 494b184: Permalink compilation optimizations:

  - Permalinks now short-circuit to raw strings if they don't contain Vento template syntax, avoiding compilation entirely.
  - Permalinks are now assigned (fake) pathnames in Vento's cache. If you change template content but don't change a dynamic permalink in development, Vento will reuse the compiled permalink template. Note that **any** modifications to a template file will **always** cause it to be recompiled (see 19c352fa) — this improvement just optimizes recompiling dynamic permalinks that haven't changed.

### Patch Changes

- 4b4b387: Entries for changed files are now deleted from Vento's cache when running the Eleventy Dev server. (fixes #38)

## 3.0.3-next.0

### Patch Changes

- e811123: Partially reverts e46ce6ea, refine caching logic. Pre-compile, the plugin checks the Vento cache to see what source needs compiling and if that matches what was already compiled. If not, then the cache is cleared so Vento can recompile.
- 2f32efb: Clear Vento cache on every template change, to help with #38. Resolution is still WIP.

## 3.0.2

### Patch Changes

- e46ce6e: Integrate eleventy and vento caching.

  There have been a few issues around managing Vento's cache that have yielded uninteded results when compiling templates (ie #10, #34). This update integrates Vento's cache with Eleventy's custom extension API.

  This means that whether running Eleventy in `--serve` mode or compiling dynamic permalinks, stale cache data actually gets removed so Vento can compile the template from source again.

  Raise any issues if caching behavior continues to be an issue!

## 3.0.1

### Patch Changes

- 9f5a90f: Various Refactors - These changes shouldn't have any observable effect on your templates or usage.

  - Replaced `class` based approach for a closure implementation instead. Since there was only 1 Vento `env` object ever instanced in this plugin, steering away from using `class` removes some complexity and overhead.

  - `DATA_KEYS` (used internally) moved into utils file alongside other utilities (like compatibility checks) and renamed to `CONTEXT_DATA_KEYS`.

  - Moved internal Vento/11ty data from env.\_11ty => env.utils.\_11ty. Previous versions mutated the Vento `env` object by adding an `_11ty` key with everything that needed accessing from within a template compile (shortcodes, filters, etc.). This was moved this back to `env.utils._11ty` since it's probably a more appropriate place to store these functions.

## 3.0.0

### Major Changes

- 668700c: Enforce new minimum version — [Eleventy v3.0.0-alpha.15](https://github.com/11ty/eleventy/releases/tag/v3.0.0-alpha.15) or later is now **required** for this plugin to function.

  Although this goes against the _backwards compatibility_ ethos of Eleventy, the addition of the `getShortcodes()` and `getPairedShortcodes()` functions that were added in `alpha.15` are now utilized in this plugin to bring even more goodness to your templates.

  Thanks [@zachleat](https://github.com/zachleat) for making this possible!

- 9d8eb8a: Adds complete support for Eleventy shortcodes and filters within Vento. Shortcodes are now loaded by default as Vento tags and will no longer be exposed as functions in your page data.

  The implementation of single shortcodes remains largely similar, just replace function-like calls with Vento tags.

  ```diff
  - {{ nametag('Noel', 'Forte') }}
  + {{ nametag 'Noel', 'Forte' }}
  ```

  Of course, the big news is that **paired** shortcodes are now officially supported by this plugin!! Prior to this release, paired shortcodes were exposed just like regular shortcodes, but were plain JS functions. With this release you can now use paired shortcodes just like any other tag.

  ```vto
  <!-- Before: everything is jammed into the function call :( -->
  {{ blockquote("<p>Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</p>\n<p>It is a way I have of driving off the spleen and regulating the circulation.</p>", "Herman Melville", "1851") }}

  <!-- After: opening and closing tags with arguments separated :) -->
  {{ blockquote 'Herman Melville', '1851' }}
    <p>Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</p>
    <p>It is a way I have of driving off the spleen and regulating the circulation.</p>
  {{ /blockquote }}
  ```

  Because these changes removed direct dependence on Eleventy JavaScript functions, the `addHelpers` option has been replaced with 3 new options: `shortcodes`, `pairedShortcodes` and `filters`. **All of them are enabled by default** but can be disabled in your plugin config like so.

  ```diff
  eleventyConfig.addPlugin(VentoPlugin, {
  - addHelpers: false,
  + shortcodes: false,
  + pairedShortcodes: false,
  + filters: false,
  });
  ```

- 516cd2f: Modifications to `auto_trim` functionality

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

### Minor Changes

- ff75e09: Add option to explicitly enable tag ignore syntax.

  Prior to this release this feature was referred to as the "SSR" or "hybrid-rendering" syntax. It's purpose was to skip over processing a tag like Vento's built-in `{{ echo }}` tag, but with a much shorter syntax: `{{! ... }}`. Any code following a `!` in your markup is wrapped in `{{ }}` and output as-is.

  ```vto
  {{!> console.log('Hello world'); }} <!-- tag remains in output -->
  ```

  In this release, this behavior is now explicitly opt-in. To enable it, include `ignoreTag: true` in the plugin options:

  ```js
  eleventyConfig.addPlugin(VentoPlugin, {
    ignoreTag: true,
  });
  ```

- b9e8232: Update ventojs to 1.12.10

## 2.6.0

### New Features

- fine-tune caching ([5b5035a](https://github.com/noelforte/eleventy-plugin-vento/commit/5b5035aedd89f57cb7d06e23d6fdef26fde55644))

### Bug Fixes

- remove `inputPath` from cache if `rawInput` doesn't match `inputContent` ([529d0b5](https://github.com/noelforte/eleventy-plugin-vento/commit/529d0b56fcc9175c698c7f243db51f79088d0849))

## 2.5.0

### Dependency Updates

- update dependency ventojs to v0.12.9 ([2f664f3](https://github.com/noelforte/eleventy-plugin-vento/commit/2f664f39fac591b5daf9154b2c639542a65d9aad))

## 2.4.0

### Dependency Updates

- update dependency ventojs to v0.12.8 ([f08ed15](https://github.com/noelforte/eleventy-plugin-vento/commit/f08ed15e42b67a044ac171156d6bf768e6bed7e5))

## 2.3.0

### New Features

- `!` tag ([49bdaf8](https://github.com/noelforte/eleventy-plugin-vento/commit/49bdaf8a0ac65a3bab6d7de5abcba7c20ee3fcaf))

## 2.2.0

### New Features

- update ventojs to 0.12.7 ([f4735ba](https://github.com/noelforte/eleventy-plugin-vento/commit/f4735bacdeae3605cdc0ba4e8b9bc9ec2f84d30d))

### Bug Fixes

- remove input path when compiling permalinks, it messes up the cache ([7dcae1a](https://github.com/noelforte/eleventy-plugin-vento/commit/7dcae1a7eb4b8611d5df982e42f6abe9b69f2871))

## 2.1.0

### New Features

- only bind `page` and `eleventy` to helper functions to align with core functionality ([a2e023c](https://github.com/noelforte/eleventy-plugin-vento/commit/a2e023cab00666046f99dc99857a77514be4622d))

### Bug Fixes

- `trimTags` now applies default tags as expected when set to `true` ([9b25279](https://github.com/noelforte/eleventy-plugin-vento/commit/9b252796f3bb31963a5435bc0cc1e238392c74e1))
- **filters:** use env.filters instead of filters so filters load correctly ([145029e](https://github.com/noelforte/eleventy-plugin-vento/commit/145029efc3b421b04189b665740825b4f32eff2c))
- use `eleventyConfig.directories` to resolve `includes` directory ([3e1a88a](https://github.com/noelforte/eleventy-plugin-vento/commit/3e1a88a0e651033e7bba35431bcb0ce8d16a9cd7))

## 2.0.0

### ⚠ BREAKING CHANGES

- rework filters to pull from eleventy definitions rather than defining a separate object

### New Features

- compile permalinks with vento using instance configuration ([170dc4d](https://github.com/noelforte/eleventy-plugin-vento/commit/170dc4d5a45f8a3dd25f57b99cfea9db8196a820))
- rework filters to pull from eleventy definitions rather than defining a separate object ([a98355a](https://github.com/noelforte/eleventy-plugin-vento/commit/a98355a8a0fcdc8f63ba507997f1a5e93b0b266a))
- wire up internal autoTrim plugin as trimTags option ([7756c06](https://github.com/noelforte/eleventy-plugin-vento/commit/7756c06f02ccbab5a689909e66733d09d1ab2c19))

### Bug Fixes

- add exports to package.json ([b07c53b](https://github.com/noelforte/eleventy-plugin-vento/commit/b07c53bc6a804608ad7a395a1f1e8d540ebaded8))
- exports from VentoPlugin and imports/syntax on eleventy.config.js ([f719c99](https://github.com/noelforte/eleventy-plugin-vento/commit/f719c990580241c343e7e2c0753926a6086d4e32))
- only compile linkContents if it's a string ([ddca393](https://github.com/noelforte/eleventy-plugin-vento/commit/ddca393d837c175e8f3707cea9e1eb863bd10ec3))
- set up filters beforehand so they're accessible in permalinks ([58a4992](https://github.com/noelforte/eleventy-plugin-vento/commit/58a4992ea56778d8da28869c3ae06a499243cf90))

## 2.0.0-beta.5

### Bug Fixes

- compile permalinks properly so permalinks starting with `/` don't default to their `permalink` values ([fc69db5](https://github.com/noelforte/eleventy-plugin-vento/commit/fc69db5b60acb0ba1a0aa5247ad71ace6610c3b7))
- move cache clearing to compile step, rather than eleventy.before. ([44a424c](https://github.com/noelforte/eleventy-plugin-vento/commit/44a424cf0b10b641f67aadba0670f112e6e0d06c))

## 2.0.0-beta.4

### Bug Fixes

- only compile linkContents if it's a string ([ddca393](https://github.com/noelforte/eleventy-plugin-vento/commit/ddca393d837c175e8f3707cea9e1eb863bd10ec3))

## 2.0.0-beta.3

### Bug Fixes

- set up filters beforehand so they're accessible in permalinks ([58a4992](https://github.com/noelforte/eleventy-plugin-vento/commit/58a4992ea56778d8da28869c3ae06a499243cf90))

## 2.0.0-beta.2

### New Features

- compile permalinks with vento using instance configuration ([170dc4d](https://github.com/noelforte/eleventy-plugin-vento/commit/170dc4d5a45f8a3dd25f57b99cfea9db8196a820))

## 1.1.3

### Bug Fixes

- move cache clearing to compile step, rather than eleventy.before. ([44a424c](https://github.com/noelforte/eleventy-plugin-vento/commit/44a424cf0b10b641f67aadba0670f112e6e0d06c))

## 2.0.0-beta.1

### ⚠ BREAKING CHANGES

The 2.0.0 release of this plugin does away with a separate filters object and defers all filter handling to Eleventy. This way any filters you already have in your Eleventy code don't have to be defined twice. If this project had started with a 0.x.x version then I wouldn't be pushing 2.0 out this fast, but I'm new to releasing npm packages so we started on 1.0. Thanks for your patience as I learn the ins and outs of SemVer!!

### New Features

- rework filters to pull from eleventy definitions rather than defining a separate object ([a98355a](https://github.com/noelforte/eleventy-plugin-vento/commit/a98355a8a0fcdc8f63ba507997f1a5e93b0b266a))
- wire up internal autoTrim plugin as trimTags option ([7756c06](https://github.com/noelforte/eleventy-plugin-vento/commit/7756c06f02ccbab5a689909e66733d09d1ab2c19))

### Bug Fixes

- add exports to package.json ([b07c53b](https://github.com/noelforte/eleventy-plugin-vento/commit/b07c53bc6a804608ad7a395a1f1e8d540ebaded8))
- exports from VentoPlugin and imports/syntax on eleventy.config.js ([f719c99](https://github.com/noelforte/eleventy-plugin-vento/commit/f719c990580241c343e7e2c0753926a6086d4e32))

## 1.1.2

### Bug Fixes

- compile permalinks properly so permalinks starting with `/` don't default to their `permalink` values ([fc69db5](https://github.com/noelforte/eleventy-plugin-vento/commit/fc69db5b60acb0ba1a0aa5247ad71ace6610c3b7))

## v1.1.1

Add example to docs showing examples for loading plugins.

## v1.1.0

- Add ability to load Vento plugins.
