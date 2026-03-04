// Function that handles creating the Vento environment. Exposes
// a small API for Eleventy to interface with.

// External modules
import createVentoEnv, { type Options as VentoOptions } from 'ventojs';
import type { Plugin, Template } from 'ventojs/core/environment.js';
import { VentoError } from 'ventojs/core/errors.js';
import type { EleventyDataCascade, EleventyFunctionMap } from './types/eleventy.js';

// Internal modules
import { createVentoTag } from './utils/create-vento-tag.js';
import { EleventyVentoError } from './utils/errors.js';
import { debug } from './utils/logging.js';

export function createVentoEngine(options: VentoOptions) {
	const env = createVentoEnv(options);
	env.utils.eleventyFunctions = { shortcodes: {}, pairedShortcodes: {} };

	function loadPlugins(plugins: Plugin[]) {
		for (const plugin of plugins) {
			env.use(plugin);
		}
	}

	function loadFilters(filters: EleventyFunctionMap) {
		for (const [name, fn] of Object.entries(filters)) {
			env.filters[name] = function (...args) {
				const { page, eleventy } = this.data;
				return fn.apply({ ...this, page, eleventy }, args);
			};
		}
	}

	function loadShortcodes(shortcodes: EleventyFunctionMap) {
		for (const [name, fn] of Object.entries(shortcodes)) {
			// Add shortcode function to environment
			env.utils.eleventyFunctions.shortcodes[name] = fn;

			// Create tag for shortcode and add it to the environment
			const shortcodeTag = createVentoTag({ name, group: 'shortcodes' });
			env.tags.push(shortcodeTag);
		}
	}

	function loadPairedShortcodes(pairedShortcodes: EleventyFunctionMap) {
		for (const [name, fn] of Object.entries(pairedShortcodes)) {
			// Add shortcode function to environment
			env.utils.eleventyFunctions.pairedShortcodes[name] = fn;

			// Create tag for paired shortcode and add it to the environment
			const shortcodeTag = createVentoTag({ name, group: 'pairedShortcodes' });
			env.tags.push(shortcodeTag);
		}
	}

	async function getTemplateFunction(source: string, file: string, useVentoCache: boolean = true) {
		// Attempt to retrieve template function from cache
		let template = await env.cache.get(file);

		if (template?.source === source) {
			debug.cache('Cache HIT for `%s`, using precompiled template', file);
			return template;
		}

		try {
			debug.cache('Cache MISS for `%s`, will compile new template function', file);
			template = env.compile(source, file);

			if (useVentoCache) {
				env.cache.set(file, template);
			}

			return template;
		} catch (error) {
			if (error instanceof VentoError) {
				throw await EleventyVentoError.createFromContext(error);
			}
			throw error;
		}
	}

	return {
		cache: env.cache,
		loadPlugins,
		loadFilters,
		loadShortcodes,
		loadPairedShortcodes,
		getTemplateFunction,
	};
}

export async function renderVentoTemplate(
	template: Template,
	data: EleventyDataCascade,
	from: string
) {
	try {
		debug.render('Rendering `%s`', from);
		const { content } = await template(data);
		return content;
	} catch (error) {
		if (error instanceof VentoError) {
			throw await EleventyVentoError.createFromContext(error);
		}
		throw error;
	}
}
