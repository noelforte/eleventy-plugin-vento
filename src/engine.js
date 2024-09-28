/**
 * @file Function that handles creating the Vento environment. Exposes
 * a simple API for Eleventy to interface with.
 *
 * @typedef {{eleventy?: Record<string, unknown>, page?: Record<string, unknown>}} EleventyContext
 * @typedef {Context & Record<string, unknown>} EleventyData
 * @typedef {(...args: unknown[]) => unknown} EleventyFunction
 * @typedef {import('ventojs/src/environment.js').Environment} VentoEnvironment
 * @typedef {VentoEnvironment & {
 *   utils: { _11ty: { ctx: Context, tags: Record<string, EleventyFunction> } }
 * }} EleventyVentoEnvironment
 */

// External library
import ventojs from 'ventojs';

// Internal modules
import { createVentoTag } from './modules/create-vento-tag.js';
import { CONTEXT_DATA_KEYS } from './modules/utils.js';

/** @param {import('ventojs').Options} options */
export function createVentoEngine(options) {
	/** @type {EleventyVentoEnvironment} */
	const env = ventojs(options);
	env.utils._11ty = { ctx: {}, functions: {} };

	return {
		/** @param {string?} key */
		emptyCache(key) {
			return key ? env.cache.delete(key) : env.cache.clear();
		},

		/** @param {import('ventojs/src/environment.js').Plugin[]} plugins */
		loadPlugins(plugins) {
			for (const plugin of plugins) {
				env.use(plugin);
			}
		},

		/** @param {PageData} newContext  */
		loadContext(newContext) {
			// Loop through allowed keys and load those into the context
			for (const K of CONTEXT_DATA_KEYS) {
				env.utils._11ty.ctx[K] = newContext[K];
			}
		},

		/** @param {Record<string, EleventyFunction>} filters */
		loadFilters(filters) {
			for (const [name, fn] of Object.entries(filters)) {
				env.filters[name] = (...args) => fn.apply(env.utils._11ty.ctx, args);
			}
		},

		/**
		 * @param {Record<string, EleventyFunction>} shortcodes
		 * @param {boolean} paired
		 */
		loadShortcodes(shortcodes, paired = false) {
			for (const [name, fn] of Object.entries(shortcodes)) {
				env.utils._11ty.functions[name] = fn;
				env.tags.push(createVentoTag(name, paired));
			}
		},

		/**
		 * @param {PageData} data
		 * @param {string} content
		 * @param {string} path
		 */
		async process(data, content, path) {
			// Reload context
			this.loadContext(data);

			// Process the templates
			const result = await env.runString(content, data, path);

			// Clear the cache for this path if the input doesn't match
			if (data.page?.rawInput !== content) env.cache.clear(path);

			return result.content;
		},
	};
}
