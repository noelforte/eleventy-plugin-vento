/**
 * @file Factory function that creates vento tags from eleventy functions
 */

import type { EleventyVentoEnvironment } from '../types/vento.js';
import type { Token } from 'ventojs/src/tokenizer.js';

export type EleventyTag = (
	env: EleventyVentoEnvironment,
	code: string,
	output: string,
	tokens: Token[]
) => string | undefined;

export type EleventyTagInfo = {
	name: string;
	group: 'shortcodes' | 'pairedShortcodes';
};

export function createVentoTag(tagInfo: EleventyTagInfo) {
	const IS_PAIRED = tagInfo.group === 'pairedShortcodes';
	let INT = 0;

	const tag: EleventyTag = (env, code, output, tokens) => {
		if (!code.startsWith(tagInfo.name)) return;

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
			const nestedVarname = `__arg${INT++}`;

			args.unshift(env.compileFilters(tokens, nestedVarname, env.options.autoescape));
			compiled.push(
				'{',
				`let ${nestedVarname} = "";`,
				...env.compileTokens(tokens, nestedVarname, [`/${tagInfo.name}`])
			);
			if (tokens.length > 0 && (tokens[0][0] !== 'tag' || tokens[0][1] !== `/${tagInfo.name}`)) {
				throw new Error(`Vento: Missing closing tag for ${tagInfo.name} tag: ${code}`);
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
		value: `${tagInfo.name}_${IS_PAIRED ? `EleventyPairedTag` : `EleventyTag`}`,
	});
}
