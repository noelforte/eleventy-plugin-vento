/**
 * @file Definition for tag that preserves vento syntax in output
 */

import type { Environment, Tag } from 'ventojs/src/environment.js';

const tag: Tag = (_env, code, output, _tokens) => {
	if (!code.startsWith('!')) return;
	const compiled = `{{${code.replace(/!(>?)\s+/, '$1 ')}}}`;
	return `${output} += "${compiled}";`;
};

export function ignoreTagPlugin(env: Environment) {
	env.tags.push(tag);
}
