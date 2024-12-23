export const config = {
	dir: {
		layouts: '_layouts',
	},
};

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function eleventy(eleventyConfig) {
	// Global data
	eleventyConfig.addGlobalData('listTypes', () => listTypes);

	// Virtual templates
	const filterTests = ['with-this-example-1', 'with-this-example-2'];

	for (const slug of filterTests) {
		eleventyConfig.addTemplate(`filters/${slug}.vto`, '{{ page.url |> pageUrlCompare }}');
	}

	eleventyConfig.addTemplate('filters/with-env-compile.vto', "{{ '{{ 2 + 2 }}' |> await vento }}");

	// Filters
	eleventyConfig.addFilter('wrapWith', (content, tag = 'span') => `<${tag}>${content}</${tag}>`);

	eleventyConfig.addFilter('pageUrlCompare', function (url) {
		return this.page.url === url;
	});

	eleventyConfig.addFilter('vento', async function (content) {
		const result = await this.env.runString(content);
		return result.content;
	});

	// Shortcodes
	eleventyConfig.addShortcode('helloWorld', () => 'Hello world!');
	eleventyConfig.addShortcode('possumPosse', (number = 'the') => `Release ${number} possums!!!`);
	eleventyConfig.addShortcode('pageUrlCompare', function (url) {
		return this.page.url === url ? 'page matched' : "page didn't match";
	});

	eleventyConfig.addShortcode('types', (stringType, numberType, booleanType) => {
		const checks = [
			typeof stringType === 'string',
			typeof numberType === 'number',
			typeof booleanType === 'boolean',
		];

		const test = checks.every((check) => check === true);

		return `${test}`;
	});

	eleventyConfig.addPairedShortcode(
		'sectionWrap',
		(content, classname) =>
			`<section${classname ? ` class="${classname}"` : ''}>${content}</section>`
	);

	eleventyConfig.addPairedShortcode(
		'codeBlock',
		(content, languageID = 'text') =>
			`<pre class="code-block"><code class="lang-${languageID}">${content}</code></pre>`
	);

	eleventyConfig.addPairedShortcode('appendPageUrl', function (content) {
		return `${content}\n<span class="url">${this.page.url}</span>`;
	});
}

function listTypes(...args) {
	return args.map((arg, index) => `Type of args[${index}]: '${typeof arg}'`).join('<br>\n');
}
