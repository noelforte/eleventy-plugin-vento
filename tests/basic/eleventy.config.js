function listTypes(...args) {
	return args.map((arg, index) => `Type of args[${index}]: '${typeof arg}'`).join('<br>\n');
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function eleventy(eleventyConfig) {
	eleventyConfig.addGlobalData('listTypes', () => listTypes);
}
