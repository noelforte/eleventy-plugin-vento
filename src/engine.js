/**
 * @file Function that handles creating the Vento environment. Exposes
 * a simple API for Eleventy to interface with.
 *
 * @typedef {{eleventy?: Record<string, unknown>, page?: Record<string, unknown>}} EleventyContext
 * @typedef {EleventyContext & Record<string, unknown>} EleventyData
 * @typedef {(...args: unknown[]) => unknown} EleventyFunction
 * @typedef {Record<string, EleventyFunction>} EleventyFunctionSet
 * @typedef {import('ventojs/src/environment.js').Environment} VentoEnvironment
 * @typedef {VentoEnvironment & {
 *  utils: {
 * 	_11tyFns: { shortcodes: EleventyFunctionSet, pairedShortcodes: EleventyFunctionSet }
 * 	_11tyCtx: EleventyContext
 * }
 * }} EleventyVentoEnvironment
 */

// External library
import ventojs from 'ventojs';

// Internal modules
import { createVentoTag } from './modules/create-vento-tag.js';
import { CONTEXT_DATA_KEYS, DEBUG } from './modules/utils.js';

/** @param {import('ventojs').Options} options */
export function createVentoEngine(options) {
	/** @type {EleventyVentoEnvironment} */
	const env = ventojs(options);
	env.utils._11tyFns = { shortcodes: {}, pairedShortcodes: {} };
	env.utils._11tyCtx = {};

	/** @param {EleventyData} newContext */
	function setContext(newContext) {
		if (env.utils._11tyCtx?.page?.inputPath === newContext?.page?.inputPath) {
			return;
		}

		for (const K of CONTEXT_DATA_KEYS) {
			env.utils._11tyCtx[K] = newContext[K];
		}

		DEBUG.setup('Reload context, new context is: %o', env.utils._11tyCtx);
	}

	/** @param {import('ventojs/src/environment.js').Plugin[]} plugins */
	function loadPlugins(plugins) {
		for (const plugin of plugins) {
			env.use(plugin);
		}
	}

	/** @param {Record<string, EleventyFunction>} filters */
	function loadFilters(filters) {
		for (const [name, fn] of Object.entries(filters)) {
			env.filters[name] = fn.bind(env.utils._11tyCtx);
		}
	}

	/** @param {Record<string, EleventyFunction>} shortcodes */
	function loadShortcodes(shortcodes) {
		for (const [name, fn] of Object.entries(shortcodes)) {
			env.utils._11tyFns.shortcodes[name] = fn;
			env.tags.push(createVentoTag({ name, group: 'shortcodes' }));
		}
	}

	/** @param {Record<string, EleventyFunction>} pairedShortcodes */
	function loadPairedShortcodes(pairedShortcodes) {
		for (const [name, fn] of Object.entries(pairedShortcodes)) {
			env.utils._11tyFns.pairedShortcodes[name] = fn;
			env.tags.push(createVentoTag({ name, group: 'pairedShortcodes' }));
		}
	}

	return {
		cache: env.cache,
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
		loadPlugins,
		loadFilters,
		loadShortcodes,
		loadPairedShortcodes,
	};
}
