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
import { createVentoInterface } from './create-vento-interface.js';
import { DEBUG, runCompatibilityCheck } from './utils.js';
import type { VentoPluginOptions } from './types.js';

export function VentoPlugin(eleventyConfig: UserConfig, userOptions: Partial<VentoPluginOptions>) {
	DEBUG.setup('Initializing eleventy-plugin-vento');
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

		DEBUG.setup('Enabled autotrim for tags: %o', tagSet);

		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Create the vento engine instance
	DEBUG.setup('Initializing Vento environment');
	const engine = createVentoInterface(options.ventoOptions);

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
	eleventyConfig.on('eleventy.beforeWatch', async (updatedFiles: string[]) => {
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

		compile(inputContent: string, inputPath: string) {
			// Normalize input path
			inputPath = path.normalize(inputPath);

			// Retrieve the template function
			const template = engine.getTemplateFunction(inputContent, inputPath, false);

			// Return a render function
			return async (data: PageData) => await engine.render(template, data, inputPath);
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
					return async (data: PageData) => await engine.render(template, data, inputPath);
				}

				return permalinkContent;
			},
		},
	});

	DEBUG.setup('eleventy-plugin-vento initialized');
}
