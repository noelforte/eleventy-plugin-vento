/**
 * @file Helper function that creates vento tags from eleventy functions
 */

import type { Tag, TagSpec } from './types.js';

export function createVentoTag(spec: TagSpec) {
	const IS_PAIRED = spec.group === 'pairedShortcodes';

	const tag: Tag = (env, code, output, tokens) => {
		if (!code.startsWith(spec.name)) return;

		// Declare helper variables for repeated strings in template
		const fn = `__env.utils._11tyFns.${spec.group}.${spec.name}`;
		const ctx = '__env.utils._11tyCtx';
		const args = [code.replace(spec.name, '').trim()];

		const varname = output.startsWith('__shortcode_content')
			? `${output}_precomp`
			: '__shortcode_content';

		// Create an array to hold compiled template code
		const compiled = [];

		if (IS_PAIRED) {
			args.unshift(env.compileFilters(tokens, varname, env.options.autoescape));
			compiled.push(
				'{',
				`let ${varname} = "";`,
				...env.compileTokens(tokens, varname, [`/${spec.name}`])
			);
			if (tokens.length > 0 && (tokens[0][0] !== 'tag' || tokens[0][1] !== `/${spec.name}`)) {
				throw new Error(`Vento: Missing closing tag for ${spec.name} tag: ${code}`);
			}
			tokens.shift();
		}

		args.unshift(ctx);

		compiled.push(
			'{',
			`const __shortcode_result = await ${fn}.call(${args.filter(Boolean).join(', ')});`,
			`${output} += ${env.compileFilters(tokens, '__shortcode_result', env.options.autoescape)}`,
			'}'
		);

		if (IS_PAIRED) {
			compiled.push('}');
		}

		const compiledTag = compiled.join('\n');

		return compiledTag;
	};

	return Object.defineProperty(tag, 'name', {
		value: spec.name + IS_PAIRED ? `PairedTag` : `Tag`,
	});
}
