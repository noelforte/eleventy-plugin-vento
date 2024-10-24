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
import { createVentoEngine } from './engine.js';
import { ignoreTagPlugin } from './modules/ignore-tag.js';
import { DEBUG, REQUIRED_API_METHODS } from './modules/utils.js';

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {Partial<VentoPluginOptions>} userOptions
 */
export function VentoPlugin(eleventyConfig, userOptions) {
	DEBUG.setup('Initializing eleventy-plugin-vento');
	DEBUG.setup('Run compatibility check');
	for (const [method, version] of REQUIRED_API_METHODS) {
		if (!eleventyConfig?.[method]) {
			console.error(
				'[eleventy-plugin-vento] Plugin compatibility error:',
				`\`${method}\``,
				'not found. Please use Eleventy',
				version,
				'or later.'
			);
		}
	}

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
		engine.loadShortcodes(shortcodes, false);
	}
	if (options.pairedShortcodes) {
		DEBUG.setup('Loading paired shortcodes: %o', pairedShortcodes);
		engine.loadShortcodes(pairedShortcodes, true);
	}

	// HACK: Clear entire vento cache on rebuild to force updates
	eleventyConfig.on('eleventy.before', () => engine.emptyCache());

	// Add vto as a template format
	DEBUG.setup('Registering .vto as a template format');
	eleventyConfig.addTemplateFormats('vto');

	// Add extension handling
	DEBUG.setup('Registering .vto extension with eleventy');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		read: true,

		// Main compile function
		async compile(inputContent, inputPath) {
			return async (data) => await engine.process({ data, source: inputContent, path: inputPath });
		},

		// Custom permalink compilation
		compileOptions: {
			permalink(linkContents) {
				if (typeof linkContents !== 'string') {
					return linkContents;
				}

				return async (data) => engine.process({ data, source: linkContents });
			},
		},
	});
	DEBUG.setup('eleventy-plugin-vento initialized');
}
