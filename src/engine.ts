/**
 * @file Function that handles creating the Vento environment. Exposes
 * a simple API for Eleventy to interface with.
 */

// External library
import { default as ventojs, type Options } from 'ventojs';
import type { Plugin, Environment, Template } from 'ventojs/src/environment.js';
import type { EleventyFunctionMap, PageData } from './types.js';

// Internal modules
import { createVentoTag } from './create-vento-tag.js';
import { DEBUG } from './utils.js';
import type { EleventyUtils } from './types.js';

export function createVentoEngine(options: Options) {
	const env = ventojs(options) as Environment & { utils: EleventyUtils };
	env.utils._11tyFns = { shortcodes: {}, pairedShortcodes: {} };
	env.utils._11tyCtx = {};

	function loadPlugins(plugins: Plugin[]) {
		for (const plugin of plugins) {
			env.use(plugin);
		}
	}

	function loadFilters(filters: EleventyFunctionMap) {
		for (const [name, fn] of Object.entries(filters)) {
			env.filters[name] = async function (...args) {
				Object.assign(this, { page: this.data.page, eleventy: this.data.eleventy });
				return await fn.apply(this, args);
			};
		}
	}

	function loadShortcodes(shortcodes: EleventyFunctionMap) {
		for (const [name, fn] of Object.entries(shortcodes)) {
			env.utils._11tyFns.shortcodes[name] = fn;
			env.tags.push(createVentoTag({ name, group: 'shortcodes' }));
		}
	}

	function loadPairedShortcodes(pairedShortcodes: EleventyFunctionMap) {
		for (const [name, fn] of Object.entries(pairedShortcodes)) {
			env.utils._11tyFns.pairedShortcodes[name] = fn;
			env.tags.push(createVentoTag({ name, group: 'pairedShortcodes' }));
		}
	}

	function getTemplateFunction(source: string, file: string, useVentoCache: boolean = true) {
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

	return {
		cache: env.cache,
		loadPlugins,
		loadFilters,
		loadShortcodes,
		loadPairedShortcodes,
		getTemplateFunction,
	};
}

export async function renderVentoTemplate(template: Template, data: PageData, from: string) {
	DEBUG.render('Rendering `%s`', from);
	const { content } = await template(data);
	return content;
}
