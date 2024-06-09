import { runBuild } from '../get-instance.js';
import { expect, test } from 'vitest';

const results = await runBuild(import.meta.dirname, {
	eleventy(configApi) {
		configApi.addShortcode('helloWorld', () => 'Hello world!');
		configApi.addShortcode(
			'possumPosse',
			(number = 'the') => `Release ${number} possums!!!`
		);
	},
});

test('shortcode without argument', () => {
	const page = results.find(({ url }) => url === '/basic/');
	expect(page.content).toBe('Hello world!\n');
});

test('shortcode with arguments', async () => {
	const page = results.find(({ url }) => url === '/with-arguments/');
	await expect(page.content).toMatchSnapshot();
});
