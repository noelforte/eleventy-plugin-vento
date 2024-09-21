/**
 * @file Main plugin declaration
 *
 * @typedef VentoPluginOptions
 * @prop {import('ventojs/src/environment.js').Plugin[]} plugins
 * Array of vento plugins to use when compiling templates
 * @prop {boolean|string[]} autotrim
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
 */

// External modules
import autotrimPlugin, { defaultTags as autotrimDefaultTags } from 'ventojs/plugins/auto_trim.js';

// Local modules
import { VentoEngine } from './engine.js';
import { ignoreTagPlugin } from './modules/ignore-tag.js';
import { runCompatibilityCheck } from './modules/utils.js';

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {Partial<VentoPluginOptions>} userOptions
 */
export function VentoPlugin(eleventyConfig, userOptions) {
	runCompatibilityCheck(eleventyConfig);

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
		},

		// Merge in user-provided options
		...userOptions,
	};

	// Get list of filters, shortcodes and paired shortcodes
	const filters = eleventyConfig.getFilters();
	const shortcodes = eleventyConfig.getShortcodes();
	const pairedShortcodes = eleventyConfig.getPairedShortcodes();

	// Add autotrim plugin if enabled
	if (options.autotrim) {
		const defaults = ['@vento', '@11ty'];

		/** @type {Set<string>} */
		const tagSet = new Set(options.autotrim === true ? defaults : options.autotrim);

		if (tagSet.has('@vento')) {
			tagSet.delete('@vento');
			for (const name of autotrimDefaultTags) {
				tagSet.add(name);
			}
		}

		if (tagSet.has('@11ty')) {
			tagSet.delete('@11ty');
			for (const name in pairedShortcodes) {
				tagSet.add(name);
			}
		}

		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Add ignore tag plugin if enabled
	if (options.ignoreTag) {
		options.plugins.push(ignoreTagPlugin);
	}

	// Create the vento engine instance
	const vento = new VentoEngine(options.ventoOptions);

	// Ensure cache is empty
	vento.emptyCache();

	// Load plugins
	vento.loadPlugins(options.plugins);

	// Add filters, single and paired shortcodes if enabled
	if (options.filters) {
		vento.loadFilters(filters);
	}
	if (options.shortcodes) {
		vento.loadShortcodes(shortcodes, false);
	}
	if (options.pairedShortcodes) {
		vento.loadShortcodes(pairedShortcodes, true);
	}

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
