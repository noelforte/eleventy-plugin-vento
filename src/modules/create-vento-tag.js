/**
 * @file Helper function that creates vento tags from eleventy functions
 *
 * @param {string} name
 * @param {boolean} paired
 */

export function createVentoTag(name, paired) {
	/** @type {import("ventojs/src/environment.js").Tag} */
	const tag = (env, code, output, tokens) => {
		if (!code.startsWith(name)) return;

		// Declare helper object path strings
		const fn = `__env._11ty.functions.${name}`;
		const ctx = '__env._11ty.ctx';
		let args = [code.replace(name, '').trim()];

		const varname = output.startsWith('__shortcode_content')
			? `${output}_precomp`
			: '__shortcode_content';

		// Create an array to hold compiled template code
		const compiled = [];

		if (paired) {
			args.unshift(env.compileFilters(tokens, varname, env.options.autoescape));
			compiled.push(
				`{ // START paired-${name}`,
				`let ${varname} = "";`,
				...env.compileTokens(tokens, varname, [`/${name}`])
			);
			if (tokens.length > 0 && (tokens[0][0] !== 'tag' || tokens[0][1] !== `/${name}`)) {
				throw new Error(`Missing closing tag for ${name} tag: ${code}`);
			}
			tokens.shift();
		}

		// Compile arguments into a string
		args = args.some(Boolean) ? `, ${args.filter(Boolean).join(', ')}` : '';

		compiled.push(
			`{ // START ${name}`,
			`const __shortcode_result = await ${fn}.call(${ctx + args});`,
			`${output} += ${env.compileFilters(tokens, '__shortcode_result', env.options.autoescape)}`,
			`} // END ${name}`
		);

		if (paired) compiled.push(`} // END paired-${name}`);

		return compiled.join('\n');
	};

	return Object.defineProperty(tag, 'name', { value: paired ? `${name}PairedTag` : `${name}Tag` });
}
