export default function (eleventyConfig) {
	eleventyConfig.addShortcode('helloWorld', () => 'Hello world!');
	eleventyConfig.addShortcode('possumPosse', (number = 'the') => `Release ${number} possums!!!`);
}
