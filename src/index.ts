/**
 * @file Main plugin declaration
 */

// Built-ins
import path from 'node:path';

// External modules
import type { UserConfig } from '@11ty/eleventy';
import type { PageData } from './types.js';
import autotrimPlugin, { defaultTags as autotrimDefaultTags } from 'ventojs/plugins/auto_trim.js';

// Local modules
import { createVentoEngine, renderTemplate } from './create-vento-engine.js';
import { DEBUG, runCompatibilityCheck } from './utils.js';
import type { VentoPluginOptions } from './types.js';

export function VentoPlugin(eleventyConfig: UserConfig, userOptions: Partial<VentoPluginOptions>) {
	DEBUG.main('Initializing eleventy-plugin-vento');
	runCompatibilityCheck(eleventyConfig);

	const options: VentoPluginOptions = {
		// Define defaults
		autotrim: false,
		plugins: [],
		filters: true,
		shortcodes: true,
		pairedShortcodes: true,
		ventoOptions: {
			includes: (eleventyConfig.directories as Record<string, string>).includes,
		},

		// Merge in user-provided options
		...userOptions,
	};

	DEBUG.main('Merged default and user config: %O', options);

	// Get list of filters, shortcodes and paired shortcodes
	const filters = eleventyConfig.getFilters();
	DEBUG.main('Reading filters from Eleventy: %o', filters);

	const shortcodes = eleventyConfig.getShortcodes();
	DEBUG.main('Reading shortcodes from Eleventy: %o', shortcodes);

	const pairedShortcodes = eleventyConfig.getPairedShortcodes();
	DEBUG.main('Reading paired shortcodes from Eleventy: %o', pairedShortcodes);

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

		DEBUG.main('Enabled autotrim for tags: %o', tagSet);

		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Create the vento engine instance
	DEBUG.main('Initializing Vento environment');
	const engine = createVentoEngine(options.ventoOptions);

	// Load plugins
	DEBUG.main('Loading plugins: %o', options.plugins);
	engine.loadPlugins(options.plugins);

	// Add filters, single and paired shortcodes if enabled
	if (options.filters) {
		DEBUG.main('Loading filters: %o', filters);
		engine.loadFilters(filters);
	}
	if (options.shortcodes) {
		DEBUG.main('Loading shortcodes: %o', shortcodes);
		engine.loadShortcodes(shortcodes);
	}
	if (options.pairedShortcodes) {
		DEBUG.main('Loading paired shortcodes: %o', pairedShortcodes);
		engine.loadPairedShortcodes(pairedShortcodes);
	}

	// Handle emptying the cache when files are updated
	DEBUG.main('Registering Vento cache handler on eleventy.beforeWatch event');
	eleventyConfig.on('eleventy.beforeWatch', async (updatedFiles: string[]) => {
		for (let file of updatedFiles) {
			file = path.normalize(file);
			DEBUG.cache('Delete cache entry for %s', file);
			engine.cache.delete(file);
		}
	});

	// Add vto as a template format
	DEBUG.main('Registering .vto as a template format');
	eleventyConfig.addTemplateFormats('vto');

	// Add extension handling
	DEBUG.main('Registering .vto extension with eleventy');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		read: true,

		compile(inputContent: string, inputPath: string) {
			// Normalize input path
			inputPath = path.normalize(inputPath);

			// Retrieve the template function
			DEBUG.main('Getting template function for `%s`', inputPath);
			const template = engine.getTemplateFunction(inputContent, inputPath, false);

			// Return a render function
			return async (data: PageData) => await renderTemplate(template, data, inputPath);
		},

		compileOptions: {
			// Custom permalink compilation
			permalink(permalinkContent: string, inputPath: string) {
				// Short circuit if input isn't a string and doesn't look like a vento template
				if (typeof permalinkContent === 'string' && /\{\{\s+.+\s+\}\}/.test(permalinkContent)) {
					// Normalize input path
					inputPath = 'Permalink::' + path.normalize(inputPath);

					// Retrieve the template function
					const template = engine.getTemplateFunction(permalinkContent, inputPath);

					// Return a render function
					return async (data: PageData) => await renderTemplate(template, data, inputPath);
				}

				return permalinkContent;
			},
		},
	});

	DEBUG.main('eleventy-plugin-vento initialized');
}
