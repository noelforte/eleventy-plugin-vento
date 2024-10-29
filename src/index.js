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

// Built-ins
import path from 'node:path';

// External modules
import autotrimPlugin, { defaultTags as autotrimDefaultTags } from 'ventojs/plugins/auto_trim.js';

// Local modules
import { createVentoEngine } from './engine.js';
import { ignoreTagPlugin } from './modules/ignore-tag.js';
import { DEBUG, PERMALINK_PREFIX, runCompatibilityCheck } from './modules/utils.js';

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {Partial<VentoPluginOptions>} userOptions
 */
export function VentoPlugin(eleventyConfig, userOptions) {
	DEBUG.setup('Initializing eleventy-plugin-vento');
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

	DEBUG.setup('Merged default and user config: %O', options);

	// Get list of filters, shortcodes and paired shortcodes
	const filters = eleventyConfig.getFilters();
	DEBUG.setup('Reading filters from Eleventy: %o', filters);

	const shortcodes = eleventyConfig.getShortcodes();
	DEBUG.setup('Reading shortcodes from Eleventy: %o', shortcodes);

	const pairedShortcodes = eleventyConfig.getPairedShortcodes();
	DEBUG.setup('Reading paired shortcodes from Eleventy: %o', pairedShortcodes);

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

		DEBUG.setup('Enabled autotrim for tags: %o', tagSet);

		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Add ignore tag plugin if enabled
	if (options.ignoreTag) {
		DEBUG.setup('Enabling `{{! ... }}` tag syntax');
		options.plugins.push(ignoreTagPlugin);
	}

	// Create the vento engine instance
	DEBUG.setup('Initializing Vento environment');
	const engine = createVentoEngine(options.ventoOptions);

	// Load plugins
	DEBUG.setup('Loading plugins: %o', options.plugins);
	engine.loadPlugins(options.plugins);

	// Add filters, single and paired shortcodes if enabled
	if (options.filters) {
		DEBUG.setup('Loading filters: %o', filters);
		engine.loadFilters(filters);
	}
	if (options.shortcodes) {
		DEBUG.setup('Loading shortcodes: %o', shortcodes);
		engine.loadShortcodes(shortcodes);
	}
	if (options.pairedShortcodes) {
		DEBUG.setup('Loading paired shortcodes: %o', pairedShortcodes);
		engine.loadPairedShortcodes(pairedShortcodes);
	}

	// Handle emptying the cache when files are updated
	DEBUG.setup('Registering Vento cache handler on eleventy.beforeWatch event');
	eleventyConfig.on('eleventy.beforeWatch', async (updatedFiles) => {
		for (let file of updatedFiles) {
			file = path.normalize(file);
			DEBUG.cache('Delete cache entry for %s', file);
			engine.cache.delete(file);
		}
	});

	// Add vto as a template format
	DEBUG.setup('Registering .vto as a template format');
	eleventyConfig.addTemplateFormats('vto');

	// Add extension handling
	DEBUG.setup('Registering .vto extension with eleventy');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		read: true,

		// Main compile function
		async compile(source, file) {
			file = path.normalize(file);
			return async (data) => await engine.process({ source, data, file });
		},

		compileOptions: {
			// Defer all caching to Vento
			cache: false,
			// Custom permalink compilation
			permalink(source, file) {
				// Short circuit if input isn't a string and doesn't look like a vento template
				if (typeof source === 'string' && /\{\{\s+.+\s+\}\}/.test(source)) {
					file = PERMALINK_PREFIX + path.normalize(file);
					return async (data) => engine.process({ source, data, file });
				}

				return source;
			},
		},
	});

	DEBUG.setup('eleventy-plugin-vento initialized');
}
