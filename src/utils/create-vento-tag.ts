/**
 * @file Factory function that creates vento tags from eleventy functions
 */

import type { Token } from 'ventojs/core/tokenizer.js';
import type { EleventyVentoEnvironment } from '../types/vento.js';

export type EleventyTag = (
	env: EleventyVentoEnvironment,
	token: Token,
	output: string,
	tokens: Token[]
) => string | undefined;

export type EleventyTagInfo = {
	name: string;
	group: 'shortcodes' | 'pairedShortcodes';
};

export function createVentoTag(tagInfo: EleventyTagInfo) {
	let LEVEL = 1;
	const IS_PAIRED = tagInfo.group === 'pairedShortcodes';

	const tag: EleventyTag = (env, token, output, tokens) => {
		const code = token[1];
		const match = code === tagInfo.name || code.startsWith(`${tagInfo.name} `);

		if (!match) {
			// Return early if the received code is not either the tag name
			// exactly or in the case of arguments is the tag name with a space
			return;
		}

		// Grab data variable name
		const { dataVarname } = env.options;

		// Construct an object for `this`
		const thisArg = `{
			page: ${dataVarname}.page,
			eleventy: ${dataVarname}.eleventy
		}`;

		// Declare helper variables for repeated strings in template
		const fn = `__env.utils.eleventyFunctions.${tagInfo.group}.${tagInfo.name}`;
		const args = [code.replace(tagInfo.name, '').trim()];

		// Create an array to hold compiled template code
		const compiled = [];

		if (IS_PAIRED) {
			const nestedVarname = `__content${output.startsWith('__content') ? LEVEL++ : 0}`;

			args.unshift(env.compileFilters(tokens, nestedVarname, env.options.autoescape));
			compiled.push(
				'{',
				`let ${nestedVarname} = "";`,
				...env.compileTokens(tokens, nestedVarname, `/${tagInfo.name}`)
			);
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
		value: `${tagInfo.name}_${IS_PAIRED ? `EleventyPairedTag` : `EleventyTag`}`,
	});
}
