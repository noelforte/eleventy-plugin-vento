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
import { DEBUG, CONTEXT_DATA_KEYS } from './modules/utils.js';

/** @param {import('ventojs').Options} options */
export function createVentoEngine(options) {
	/** @type {EleventyVentoEnvironment} */
	const env = ventojs(options);
	env.utils._11ty = { ctx: {}, shortcodes: {}, pairedShortcodes: {} };

	return {
		/** @param {string} path */
		getCachedSource(path) {
			return env.cache.get(path)?.source;
		},

		/** @param {string} path */
		emptyCache(path) {
			return path ? env.cache.delete(path) : env.cache.clear();
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

		/** @param {Record<string, EleventyFunction>} shortcodes */
		loadShortcodes(shortcodes) {
			for (const [name, fn] of Object.entries(shortcodes)) {
				env.utils._11ty.shortcodes[name] = fn;
				env.tags.push(createVentoTag({ name, group: 'shortcodes' }));
			}
		},

		/** @param {Record<string, EleventyFunction>} pairedShortcodes */
		loadPairedShortcodes(pairedShortcodes) {
			for (const [name, fn] of Object.entries(pairedShortcodes)) {
				env.utils._11ty.pairedShortcodes[name] = fn;
				env.tags.push(createVentoTag({ name, group: 'pairedShortcodes' }));
			}
		},

		/** @param {{data: PageData, source: string, path: string}} input */
		async process(input) {
			// Reload context
			this.loadContext(input.data);
			DEBUG.setup('Reloaded Eleventy/Vento context. New value: %o', env.utils._11ty.ctx);

			// Before we compile, empty the cache if the input content doesn't match
			if (env.cache.get(input.path)?.source !== input.source) {
				env.cache.delete(input.path);
			}

			// Process the templates
			const result = await env.runString(input.source, input.data, input.path);

			return result.content;
		},
	};
}
