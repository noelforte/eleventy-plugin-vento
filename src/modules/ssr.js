/**
 * @typedef {import('ventojs/src/tokenizer.js').Token} Token
 * @typedef {import('ventojs/src/environment.js').Environment} Environment
 */

/** @param {Environment} env */
export function ssrPlugin(env) {
	env.tags.push(ssrTag);
}

/**
 * @param {string} code
 * @param {Environment} env
 * @param {string} output
 * @param {Token[]} tokens
 */
function ssrTag(env, code, output, _tokens) {
	if (!code.startsWith('!')) return;

	const compiled = `{{${code.replace(/!(>?)\s+/, '$1 ')} }}`;

	return `${output} += "${compiled}";`;
}
