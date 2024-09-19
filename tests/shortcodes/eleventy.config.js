/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function eleventy(eleventyConfig) {
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
