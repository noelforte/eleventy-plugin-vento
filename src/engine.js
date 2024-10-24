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
		cache: env.cache,

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

		/** @param {{ source: string, data: PageData, file?: string }} input */
		async process(input) {
			// Reload context
			this.loadContext(input.data);
			DEBUG.setup('Reloaded Eleventy/Vento context. New value: %o', env.utils._11ty.ctx);

			// Retrieve the template from the cache
			let template = env.cache.get(input.file);

			if (template?.source === input.source) {
				DEBUG.cache('Cache HIT for `%s`, used precompiled template', input.file);
			} else {
				template = env.compile(input.source, input.file);

				if (input.file) {
					DEBUG.cache('Cache MISS for `%s`, compiled new template', input.file);
					env.cache.set(input.file, template);
				}
			}

			// Run the template
			DEBUG.template(template.code);
			const { content } = await template(input.data);

			return content;
		},
	};
}
