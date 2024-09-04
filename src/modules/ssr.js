/**
 * @file SSR tag definition to assist with hybrid rendering
 */

/** @type {import('ventojs/src/environment.js').Tag} */
const ssrTag = (_env, code, output, _tokens) => {
	if (!code.startsWith('!')) return;
	const compiled = `{{${code.replace(/!(>?)\s+/, '$1 ')} }}`;
	return `${output} += "${compiled}";`;
};

/** @type {import('ventojs/src/environment.js').Plugin} */
export const ssr = (env) => {
	env.tags.push(ssrTag);
};
