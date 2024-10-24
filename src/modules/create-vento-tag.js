/**
 * @file Helper function that creates vento tags from eleventy functions
 *
 * @param {{name: string, group: 'shortcodes' | 'pairedShortcodes' }} options
 */

export function createVentoTag(options) {
	const IS_PAIRED = options.group === 'pairedShortcodes';

	/** @type {import("ventojs/src/environment.js").Tag} */
	const tag = (env, code, output, tokens) => {
		if (!code.startsWith(options.name)) return;

		// Declare helper variables for repeated strings in template
		const fn = `__env.utils._11ty.${options.group}.${options.name}`;
		const ctx = '__env.utils._11ty.ctx';
		const args = [code.replace(options.name, '').trim()];

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
				...env.compileTokens(tokens, varname, [`/${options.name}`])
			);
			if (tokens.length > 0 && (tokens[0][0] !== 'tag' || tokens[0][1] !== `/${options.name}`)) {
				throw new Error(`Vento: Missing closing tag for ${options.name} tag: ${code}`);
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
		value: options.name + IS_PAIRED ? `PairedTag` : `Tag`,
	});
}
