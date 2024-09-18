# eleventy-plugin-vento

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