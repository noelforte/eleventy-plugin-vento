/**
 * @file Main plugin declaration
 *
 * @typedef VentoPluginOptions
 * @prop {import('ventojs/src/environment.js').Plugin[]} plugins
 * Array of vento plugins to use when compiling templates
 * @prop {boolean|AutotrimConfig} autotrim
 * Enable Vento's [`autoTrim`](https://vento.js.org/plugins/auto-trim/)
 * plugin to remove whitespace from tags in output
 * @prop {boolean} [shortcodes=true]
 * Create vento tags for Eleventy [Shortcodes](https://www.11ty.dev/docs/shortcodes/)
 * @prop {boolean} [pairedShortcodes=true]
 * Create vento tags for Eleventy [Paired Shortcodes](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes)
 * @prop {boolean} [filters=true]
 * Create vento filters for Eleventy [Filters](https://www.11ty.dev/docs/filters/)
 * @prop {boolean} [ignoreTag=false]
 * Enables/disables tag ignore (`{{! ... }}`) syntax in templates
 * @prop {import('ventojs').Options} ventoOptions
 * Options to pass on to the `ventojs` engine.
 * (See [Vento Docs](https://vento.js.org/configuration/#options))
 *
 * @typedef AutotrimConfig
 * @prop {Array<string>} tags
 * @prop {boolean?} extend
 */

// External modules
import autotrimPlugin, { defaultTags as autotrimDefaultTags } from 'ventojs/plugins/auto_trim.js';

// Local modules
import { VentoEngine } from './engine.js';
import { ignoreTagPlugin } from './modules/ignore-tag.js';

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {Partial<VentoPluginOptions>} userOptions
 */
export function VentoPlugin(eleventyConfig, userOptions) {
	eleventyConfig.versionCheck('>= 3.0.0-beta.1');

	/** @type {VentoPluginOptions} */
	const options = {
		// Define defaults
		autotrim: false,
		plugins: [],
		filters: true,
		shortcodes: true,
		pairedShortcodes: true,
		ignoreTag: false,
		ventoOptions: {
			includes: eleventyConfig.directories.includes,
			autoescape: false,
		},

		// Merge in user-provided options
		...userOptions,
	};

	// Add autotrim plugin if enabled
	if (options.autotrim) {
		/** @type {Set<string>} */
		const tagSet = new Set(options.autotrim?.tags ?? autotrimDefaultTags);
		if (options.autotrim?.extend) {
			for (const tag of autotrimDefaultTags) tagSet.add(tag);
		}

		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Add preserve tag plugin if enabled
	if (options.ignoreTag) options.plugins.push(ignoreTagPlugin);

	// Create the vento engine instance
	const vento = new VentoEngine(options.ventoOptions);

	vento.emptyCache(); // Ensure cache is empty
	vento.loadPlugins(options.plugins); // Load plugin functions

	if (options.filters) vento.loadFilters(eleventyConfig.getFilters());
	if (options.shortcodes) vento.loadShortcodes(eleventyConfig.getShortcodes());

	// Add vto as a template format
	eleventyConfig.addTemplateFormats('vto');

	// Add extension handling
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		read: true,

		// Main compile function
		async compile(inputContent, inputPath) {
			return async (data) => vento.process(data, inputContent, inputPath);
		},

		// Custom permalink compilation
		compileOptions: {
			permalink(linkContents) {
				if (typeof linkContents !== 'string') return linkContents;
				return async (data) => vento.process(data, linkContents);
			},
		},
	});
}
