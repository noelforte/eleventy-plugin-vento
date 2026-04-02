// Function that handles creating the Vento environment. Exposes
// a small API for Eleventy to interface with.

// Built-in modules
import path from 'node:path';

// External modules
import ventojs, { type Options as VentoOptions } from 'ventojs';
import { type Plugin } from 'ventojs/core/environment.js';
import { VentoError } from 'ventojs/core/errors.js';
import type { EleventyFunctionMap, EleventyRenderFunction } from './types/eleventy.js';

// Internal modules
import { createVentoTag, type EleventyTagInfo } from './utils/create-vento-tag.js';
import { EleventyVentoError } from './utils/errors.js';
import { debug } from './utils/logging.js';

export function createVentoEngine(options: VentoOptions) {
	const env = ventojs(options);

	/**
	 * Load plugins into Vento environment
	 */
	function loadPlugins(plugins: Plugin[]) {
		for (const plugin of plugins) {
			env.use(plugin);
		}
	}

	/**
	 * Load filters into Vento environment
	 */
	function loadFilters(filters: EleventyFunctionMap) {
		for (const [name, fn] of Object.entries(filters)) {
			env.filters[name] = function (...args) {
				const { page, eleventy } = this.data;
				return fn.apply({ ...this, page, eleventy }, args);
			};
		}
	}

	/**
	 * Load shortcodes (tags) into Vento environment
	 */
	function loadShortcodes(group: EleventyTagInfo['group'], shortcodes: EleventyFunctionMap) {
		if (!(env.utils.eleventyFunctions instanceof Map)) {
			env.utils.eleventyFunctions = new Map();
		}

		for (const [name, fn] of Object.entries(shortcodes)) {
			// Add shortcode function to environment
			env.utils.eleventyFunctions.set(`${group}:${name}`, fn);

			// Create tag for shortcode and add it to the environment
			env.tags.push(createVentoTag({ name, group }));
		}
	}

	/**
	 * Clear one or more items from Vento's cache
	 */
	function removeCachedItems(items: string[]) {
		for (let item of items) {
			item = path.normalize(item);
			debug.cache('Delete cache entry for %s', item);
			env.cache.delete(item);
		}
	}

	/**
	 * Given a source string and file, compile or get a cached template function,
	 * then produce an Eleventy render function for it and return it.
	 */
	async function getRenderFunction(source: string, file: string, options?: { cache: boolean }) {
		debug.main('Getting render function for `%s`', file);

		// Attempt to retrieve template function from cache
		let template = await env.cache.get(file);

		if (template?.source === source) {
			debug.cache('Cache HIT for `%s`, using precompiled template', file);
		} else {
			// Attempt to compile a new template
			try {
				debug.cache('Cache MISS for `%s`, will compile new template function', file);
				template = env.compile(source, file);
			} catch (error) {
				if (error instanceof VentoError) {
					throw await EleventyVentoError.createFromContext(error);
				}
				throw error;
			}

			// Cache the template unless specifically requested not to
			if (options?.cache !== false) {
				env.cache.set(file, template);
			}
		}

		// Construct a render function from the returned template
		const render: EleventyRenderFunction = async (data) => {
			try {
				debug.render('Rendering %s', file);
				const { content } = await template(data);
				return content;
			} catch (error) {
				if (error instanceof VentoError) {
					throw await EleventyVentoError.createFromContext(error);
				}
				throw error;
			}
		};

		return render;
	}

	return {
		loadPlugins,
		loadFilters,
		loadShortcodes,
		removeCachedItems,
		getRenderFunction,
	};
}
