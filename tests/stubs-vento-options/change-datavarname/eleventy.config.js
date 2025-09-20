/** @param {import("@11ty/eleventy/UserConfig")} eleventyConfig */
export default function eleventy(eleventyConfig) {
	eleventyConfig.addGlobalData('greeting', 'Hello World!');
	eleventyConfig.addTemplate(`index.vto`, `{{ global.greeting }}`);
}
