// Built-ins
import path from 'node:path';

// External modules
import type { UserConfig } from '@11ty/eleventy';
import autotrimPlugin, { defaultTags as autotrimDefaultTags } from 'ventojs/plugins/auto_trim.js';

// Local modules
import { createVentoEngine, renderVentoTemplate } from './engine.js';
import type { EleventyDataCascade } from './types/eleventy.js';
import type { PluginOptions } from './types/options.js';
import { compatibilityCheck } from './utils/compat-check.js';
import { debugCache, debugMain } from './utils/debuggers.js';

export function VentoPlugin(eleventyConfig: UserConfig, userOptions: PluginOptions) {
	debugMain('Initializing eleventy-plugin-vento');
	compatibilityCheck(eleventyConfig);

	const options = {
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

	debugMain('Merged default and user config: %O', options);

	// Get list of filters, shortcodes and paired shortcodes
	const filters = eleventyConfig.getFilters();
	debugMain('Reading filters from Eleventy: %o', filters);

	const shortcodes = eleventyConfig.getShortcodes();
	debugMain('Reading shortcodes from Eleventy: %o', shortcodes);

	const pairedShortcodes = eleventyConfig.getPairedShortcodes();
	debugMain('Reading paired shortcodes from Eleventy: %o', pairedShortcodes);

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

		debugMain('Enabled autotrim for tags: %o', tagSet);

		options.plugins.push(autotrimPlugin({ tags: [...tagSet] }));
	}

	// Create the vento engine instance
	debugMain('Initializing Vento environment');
	const engine = createVentoEngine(options.ventoOptions);

	// Load plugins
	debugMain('Loading plugins: %o', options.plugins);
	engine.loadPlugins(options.plugins);

	// Add filters, single and paired shortcodes if enabled
	if (options.filters) {
		debugMain('Loading filters: %o', filters);
		engine.loadFilters(filters);
	}
	if (options.shortcodes) {
		debugMain('Loading shortcodes: %o', shortcodes);
		engine.loadShortcodes(shortcodes);
	}
	if (options.pairedShortcodes) {
		debugMain('Loading paired shortcodes: %o', pairedShortcodes);
		engine.loadPairedShortcodes(pairedShortcodes);
	}

	// Handle emptying the cache when files are updated
	debugMain('Registering Vento cache handler on eleventy.beforeWatch event');
	eleventyConfig.on('eleventy.beforeWatch', async (updatedFiles: string[]) => {
		for (let file of updatedFiles) {
			file = path.normalize(file);
			debugCache('Delete cache entry for %s', file);
			engine.cache.delete(file);
		}
	});

	// Add vto as a template format
	debugMain('Registering .vto as a template format');
	eleventyConfig.addTemplateFormats('vto');

	// Add extension handling
	debugMain('Registering .vto extension with eleventy');
	eleventyConfig.addExtension('vto', {
		outputFileExtension: 'html',
		read: true,

		compile(inputContent: string, inputPath: string) {
			// Normalize input path
			inputPath = path.normalize(inputPath);

			// Retrieve the template function
			debugMain('Getting template function for `%s`', inputPath);
			const template = engine.getTemplateFunction(inputContent, inputPath, false);

			// Return a render function
			return async (data: EleventyDataCascade) =>
				await renderVentoTemplate(template, data, inputPath);
		},

		compileOptions: {
			// Custom permalink compilation
			permalink(permalinkContent: string, inputPath: string) {
				// Short circuit if input isn't a string and doesn't look like a vento template
				if (typeof permalinkContent !== 'string' || !/\{\{\s+.+\s+\}\}/.test(permalinkContent)) {
					return permalinkContent;
				}

				// Normalize input path
				inputPath = 'Permalink::' + path.normalize(inputPath);

				// Retrieve the template function
				debugMain('Getting template function for `%s`', inputPath);
				const template = engine.getTemplateFunction(permalinkContent, inputPath);

				// Return a render function
				return async (data: EleventyDataCascade) =>
					await renderVentoTemplate(template, data, inputPath);
			},
		},
	});

	debugMain('eleventy-plugin-vento initialized');
}
