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

	/**
	 * @param {string} source
	 * @param {string} file
	 * @param {boolean} [useVentoCache=true]
	 */
	function getTemplateFunction(source, file, useVentoCache = true) {
		// Attempt to retrieve template function from cache
		let template = env.cache.get(file);

		if (template?.source === source) {
			DEBUG.cache('Cache HIT for `%s`, used precompiled template', file);
		} else {
			template = env.compile(source, file);

			DEBUG.cache(
				`Cache MISS for \`%s\`, compiled new template:\nUse Vento cache: %o\n\n${template}`,
				file,
				useVentoCache
			);
			if (useVentoCache) {
				env.cache.set(file, template);
			}
		}

		return template;
	}

	/**
	 * @param {import('ventojs/src/environment.js').Template} template
	 * @param {EleventyData} data
	 * @param {string} from
	 */
	async function render(template, data, from) {
		// Load new context
		setContext(data);

		// Render template
		DEBUG.render('Rendering `%s`', from);
		const { content } = await template(data);
		return content;
	}

	return {
		cache: env.cache,
		loadPlugins,
		loadFilters,
		loadShortcodes,
		loadPairedShortcodes,
		getTemplateFunction,
		render,
	};
}
