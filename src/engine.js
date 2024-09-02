/**
 * @file Isolated definition for vento library
 *
 * @typedef {import('ventojs/src/environment.js').Tag} VentoTag
 * @typedef {import('ventojs/src/environment.js').Filter} VentoFilter
 * @typedef {import('ventojs/src/environment.js').Plugin} VentoPlugin
 */

import vento from 'ventojs';

// TODO: Update this if it becomes possible to import `augmentKeys` from Eleventy.
const DATA_KEYS = ['page', 'eleventy'];

export class VentoEngine {
	#context = {};

	/** @param {import('ventojs').Options} options */
	constructor(options) {
		this.env = vento(options);
	}

	/** @param {string} key */
	emptyCache(key) {
		return key ? this.env.cache.delete(key) : this.env.cache.clear();
	}

	/** @param {VentoPlugin[]} plugins  */
	loadPlugins(plugins) {
		for (const plugin of plugins) {
			this.env.use(plugin);
		}
	}

	/** @param {Object<string, VentoFilter>} filters */
	loadFilters(filters) {
		for (const name in filters) {
			this.env.filters[name] = filters[name].bind(this.#context);
		}
	}

	/**
	 * A simplified version of
	 * [ContextAugmenter.js](../node_modules/@11ty/Eleventy/src/Engines/Util/ContextAugmenter.js)
	 * @param {{page?: Object<string, any>, eleventy?: Object<string, any>}} newContext
	 */
	loadContext(newContext) {
		for (const key of DATA_KEYS) {
			this.#context[key] = newContext[key];
		}
	}

	async process(data, content, path) {
		// Reload context
		this.loadContext(data);

		// Process the template
		const result = await this.env.runString(content, data, path);

		// Clear the cache for this path if the input doesn't match
		if (data.page?.rawInput !== content) this.env.cache.clear();

		return result.content;
	}
}
