/**
 * @file Class to facilitate ventojs processing
 *
 * @typedef {{eleventy?: Record<string, unknown>, page?: Record<string, unknown>}} Context
 * @typedef {Context & {[K: string]: unknown}} PageData
 */

// External library
import vento from 'ventojs';

// Local modules
import { createVentoFilter } from './modules/create-filter.js';

// TODO: Update this if it becomes possible to import `augmentKeys` from Eleventy.
const DATA_KEYS = ['page', 'eleventy'];

export class VentoEngine {
	/** @type {Context} */
	#context = {};
	#env;

	/** @param {import('ventojs').Options} options */
	constructor(options) {
		this.#env = vento(options);
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

	/** @param {Record<string, import('ventojs/src/environment.js').Filter>} filters */
	loadFilters(filters) {
		for (const name in filters) {
			this.#env.filters[name] = createVentoFilter(filters[name], this.#context);
		}
	}

	/** @param {PageData} newContext  */
	loadContext(newContext) {
		for (const key of DATA_KEYS) {
			this.#context[key] = newContext[key];
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
		if (data.page?.rawInput !== content) this.#env.cache.clear();

		return result.content;
	}
}
