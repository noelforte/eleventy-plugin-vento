/**
 * @file Create a vento filter from an Eleventy filter
 *
 * @param {(...params) => unknown} fn
 * @param {Record<string, import('src/engine.js').Context>} context
 * @returns {import('ventojs/src/environment.js').Filter}
 */
export function createVentoFilter(fn, context) {
	return (...args) => fn.apply(context, args);
}
