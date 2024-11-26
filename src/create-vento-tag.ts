/**
 * @file Factory function that creates vento tags from eleventy functions
 */

import type { Tag } from 'ventojs/src/environment.js';
import type { TagSpec } from './types.js';

export function createVentoTag(spec: TagSpec) {
	const IS_PAIRED = spec.group === 'pairedShortcodes';
	let INT = 0;

	const tag: Tag = (env, code, output, tokens) => {
		if (!code.startsWith(spec.name)) return;

		// Grab data variable name
		const { dataVarname } = env.options;

		// Construct an object for `this`
		const thisArg = `{
			page: ${dataVarname}.page,
			eleventy: ${dataVarname}.eleventy
		}`;

		// Declare helper variables for repeated strings in template
		const fn = `__env.utils.eleventyFunctions.${spec.group}.${spec.name}`;
		const args = [code.replace(spec.name, '').trim()];

		// Create an array to hold compiled template code
		const compiled = [];

		if (IS_PAIRED) {
			const nestedVarname = `__arg${INT++}`;

			args.unshift(env.compileFilters(tokens, nestedVarname, env.options.autoescape));
			compiled.push(
				'{',
				`let ${nestedVarname} = "";`,
				...env.compileTokens(tokens, nestedVarname, [`/${spec.name}`])
			);
			if (tokens.length > 0 && (tokens[0][0] !== 'tag' || tokens[0][1] !== `/${spec.name}`)) {
				throw new Error(`Vento: Missing closing tag for ${spec.name} tag: ${code}`);
			}
			tokens.shift();
		}

		args.unshift(thisArg);

		compiled.push(
			'{',
			`const __result = await ${fn}.call(${args.filter(Boolean).join(', ')});`,
			`${output} += ${env.compileFilters(tokens, '__result', env.options.autoescape)}`,
			'}'
		);

		if (IS_PAIRED) {
			compiled.push('}');
		}

		return compiled.join('\n');
	};

	return Object.defineProperty(tag, 'name', {
		value: spec.name + IS_PAIRED ? `PairedTag` : `Tag`,
	});
}
