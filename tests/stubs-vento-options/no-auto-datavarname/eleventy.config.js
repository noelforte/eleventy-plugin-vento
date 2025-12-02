/**
 * @import UserConfig from '@11ty/eleventy/UserConfig'
 * @param {UserConfig} eleventyConfig
 */
export default function eleventy(eleventyConfig) {
	eleventyConfig.addGlobalData('greeting', 'Hello World!');
	eleventyConfig.addTemplate(`index.vto`, `{{ it.greeting }}`);
}
