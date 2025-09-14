---
'eleventy-plugin-vento': major
---

Update Vento language library to v2

This is a redo of release 4.6.0, now repackaged as a major release. As noted by @oscarotero in #327, Vento v2 is largely compatible with v1, so there shouldn't be any significant changes needed within your templates. Furthermore, he's released v2.0.2 (which this plugin has already adopted) that should solve the majority of incompatibility issues. Changes were made in 523a84ff and cdf5b104 to account for breaking changes upstream, though do be sure to review your own templates and configs for any breaking changes!

More critical to note for Vento v2 is the rearrangement of core library features that this plugin exposes. Definitely review [the changelog for v2](https://github.com/ventojs/vento/blob/main/CHANGELOG.md#200---2025-09-01) to determine whether your implementation needs updating.

The biggest changes are:

- `meriyah` was removed via https://github.com/ventojs/vento/pull/128 at the benefit of performance. If you were absorbing `meriyah`'s functionality via this plugin, you should adjust accordingly.
- `runStringSync` is no longer supported and has been removed
- `ventoOptions.useWith` was previously deprecated and has since been removed. If you relied on `useWith` in your [plugin options](https://github.com/noelforte/eleventy-plugin-vento?tab=readme-ov-file#plugin-options), you should instead use `ventoOptions.dataVarname` and `ventoOptions.autoDataVarname` to control how the global namespace for template data is exposed. For more info, see more on [the Vento docs](https://vento.js.org/configuration/#datavarname).
- Other external dependencies such as `ESTree` have also been removed and thusly are no longer accessible via this plugin.

_Side note: I've been considering migrating the integration this plugin provides with Eleventy Shortcodes to something more modular, [like how Lume handles components](https://lume.land/docs/core/components/). If this is something you're interested in, let me know by opening an issue!_
