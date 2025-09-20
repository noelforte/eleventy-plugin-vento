/** @param {import("@11ty/eleventy/UserConfig")} eleventyConfig */
export default function eleventy(eleventyConfig) {
	eleventyConfig.addShortcode(
		'button',
		(url, text) => `<a class="magic-button" href="${url}">${text}</a>`
	);

	eleventyConfig.addPairedShortcode(
		'highlight',
		(content, color) => `<span style="background-color:${color};">${content}</span>`
	);

	eleventyConfig.addPairedShortcode(
		'card',
		(text, title, cta, link, type) =>
			`<article class="card ${type}">
				<header>${title}</header>
				${text}
				<footer>
					<a href="${link}">${cta}</a>
				</footer>
			</article>`
	);
}
