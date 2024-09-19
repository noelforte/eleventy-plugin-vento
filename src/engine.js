/**
 * @file Class to facilitate ventojs processing
 *
 * @typedef {{eleventy?: Record<string, unknown>, page?: Record<string, unknown>}} EleventyContext
 * @typedef {Context & Record<string, unknown>} EleventyData
 * @typedef {(...args: unknown[]) => unknown} EleventyFunction
 * @typedef {import('ventojs/src/environment.js').Environment} VentoEnvironment
 * @typedef {VentoEnvironment & { _11ty: { ctx: Context, tags: Record<string, EleventyFunction> }}} EleventyVentoEnvironment
 */

// External library
import ventojs from 'ventojs';

// Internal modules
import { createVentoTag } from './modules/create-vento-tag.js';

// TODO: Update this if it becomes possible to import `augmentKeys` from Eleventy.
const DATA_KEYS = ['page', 'eleventy'];

export class VentoEngine {
	#env;

	/** @param {import('ventojs/src/environment.js').Options} options */
	constructor(options) {
		/** Initialize vento @type {EleventyVentoEnvironment} */
		this.#env = ventojs(options);
		this.#env._11ty = { ctx: {}, functions: {} };
	}

	/** @param {string?} key */
	emptyCache(key) {
		return key ? this.#env.cache.delete(key) : this.#env.cache.clear();
	}

	/** @param {import('ventojs/src/environment.js').Plugin[]} plugins */
	loadPlugins(plugins) {
		for (const plugin of plugins) {
			this.#env.use(plugin);
		}
	}

	/** @param {PageData} newContext  */
	loadContext(newContext) {
		// Loop through allowed keys and load those into the context
		for (const key of DATA_KEYS) {
			this.#env._11ty.ctx[key] = newContext[key];
		}
	}

	/** @param {Record<string, EleventyFunction>} filters */
	loadFilters(filters) {
		for (const [name, fn] of Object.entries(filters)) {
			this.#env.filters[name] = (...args) => fn.apply(this.#env._11ty.ctx, args);
		}
	}

	/**
	 * @param {Record<string, EleventyFunction>} shortcodes
	 * @param {boolean} paired
	 */
	loadShortcodes(shortcodes, paired = false) {
		for (const [name, fn] of Object.entries(shortcodes)) {
			this.#env._11ty.functions[name] = fn;
			this.#env.tags.push(createVentoTag(name, paired));
		}
	}

	/**
	 * @param {PageData} data
	 * @param {string} content
	 * @param {string} path
	 */
	async process(data, content, path) {
		// Reload context
		this.loadContext(data);

		// Process the templates
		const result = await this.#env.runString(content, data, path);

		// Clear the cache for this path if the input doesn't match
		if (data.page?.rawInput !== content) this.#env.cache.clear(path);

		return result.content;
	}
}
