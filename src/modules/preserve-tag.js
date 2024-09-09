/**
 * @file Definition for tag that preserves vento syntax in output
 */

/** @type {import('ventojs/src/environment.js').Tag} */
function preserveTag(_env, code, output, _tokens) {
	if (!code.startsWith('!')) return;
	const compiled = `{{${code.replace(/!(>?)\s+/, '$1 ')}}}`;
	return `${output} += "${compiled}";`;
}

/** @type {import('ventojs/src/environment.js').Plugin} */
export function preserveTagPlugin(env) {
	env.tags.push(preserveTag);
}
