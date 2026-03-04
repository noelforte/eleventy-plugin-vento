// eleventy-plugin-vento main entry point
//
// This file contains the main plugin function and defers
// other functionality (like custom tag handling, debugging,
// and rendering) to other files.

// Built-ins
import path from 'node:path';

// External modules
import autotrimPlugin, { defaultTags as autotrimDefaultTags } from 'ventojs/plugins/auto_trim.js';
import type { UserConfig } from './types/eleventy.js';

// Local modules
import { createVentoEngine, renderVentoTemplate } from './engine.js';
import type { EleventyDataCascade } from './types/eleventy.js';
import type { PluginOptions } from './types/options.js';
import { debug } from './utils/logging.js';

export function VentoPlugin(eleventyConfig: UserConfig, userOptions?: Partial<PluginOptions>) {
	debug.main('Initializing eleventy-plugin-vento');
	eleventyConfig.versionCheck('>=3.0.0');

	const options: PluginOptions = {
		// Define defaults
		autotrim: false,
		plugins: [],
		filters: true,
		shortcodes: true,
		pairedShortcodes: true,
		ventoOptions: {
			includes: eleventyConfig.directories.includes,
		},

		// Merge in user-provided options
		...userOptions,
	};

	debug.main('Merged default and user config: %O', options);

	// Get list of filters, shortcodes and paired shortcodes
	const filters = eleventyConfig.getFilters();
	debug.main('Reading filters from Eleventy: %o', filters);

	const shortcodes = eleventyConfig.getShortcodes();
	debug.main('Reading shortcodes from Eleventy: %o', shortcodes);

	const pairedShortcodes = eleventyConfig.getPairedShortcodes();
	debug.main('Reading paired shortcodes from Eleventy: %o', pairedShortcodes);

	// Add autotrim plugin if enabled
	if (options.autotrim) {
		const defaults = ['@vento', '@11ty'];

		const tagSet: Set<string> = new Set(options.autotrim === true ? defaults : options.autotrim);

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

		debug.main('Enabled autotrim for tags: %o', tagSet);

		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Create the vento engine instance
	debug.main('Initializing Vento environment');
	const engine = createVentoEngine(options.ventoOptions);

	// Load plugins
	debug.main('Loading plugins: %o', options.plugins);
	engine.loadPlugins(options.plugins);

	// Add filters, single and paired shortcodes if enabled
	if (options.filters) {
		debug.main('Loading filters: %o', filters);
		engine.loadFilters(filters);
	}
	if (options.shortcodes) {
		debug.main('Loading shortcodes: %o', shortcodes);
		engine.loadShortcodes(shortcodes);
	}
	if (options.pairedShortcodes) {
		debug.main('Loading paired shortcodes: %o', pairedShortcodes);
		engine.loadPairedShortcodes(pairedShortcodes);
	}

	// Handle emptying the cache when files are updated
	debug.main('Registering Vento cache handler on eleventy.beforeWatch event');
	eleventyConfig.on('eleventy.beforeWatch', async (updatedFiles: string[]) => {
		for (let file of updatedFiles) {
			file = path.normalize(file);
			debug.cache('Delete cache entry for %s', file);
			engine.cache.delete(file);
		}
	});

	// Add vto as a template format
	debug.main('Registering .vto as a template format');
	eleventyConfig.addTemplateFormats('vto');

	// Add extension handling
	debug.main('Registering .vto extension with eleventy');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		read: true,

		async compile(inputContent: string, inputPath: string) {
			// Normalize input path
			inputPath = path.normalize(inputPath);

			// Retrieve the template function
			debug.main('Getting template function for `%s`', inputPath);
			const template = await engine.getTemplateFunction(inputContent, inputPath, false);

			// Return a render function
			return async (data: EleventyDataCascade) =>
				await renderVentoTemplate(template, data, inputPath);
		},

		compileOptions: {
			// Custom permalink compilation
			async permalink(permalinkContent: string, inputPath: string) {
				// Short circuit if input isn't a string and doesn't look like a vento template
				if (typeof permalinkContent !== 'string' || !/\{\{\s+.+\s+\}\}/.test(permalinkContent)) {
					return permalinkContent;
				}

				// Normalize input path and prepend a specifier to disambiguate
				// cached dynamic permalinks and cached templates
				inputPath = 'EleventyVentoDynamicPermalink:'.concat(path.normalize(inputPath));

				// Retrieve the template function
				debug.main('Getting template function for `%s`', inputPath);
				const template = await engine.getTemplateFunction(permalinkContent, inputPath);

				// Return a render function
				return async (data: EleventyDataCascade) =>
					await renderVentoTemplate(template, data, inputPath);
			},
		},
	});

	debug.main('eleventy-plugin-vento initialized');
}
