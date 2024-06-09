import { expect, test } from 'vitest';
import { runBuild } from '../get-instance.js';

const results = await runBuild(import.meta.dirname, {
	eleventy(configApi) {
		configApi.addFilter(
			'uppercase',
			/** @param {string} content */
			(content) => content.toUpperCase()
		);

		configApi.addFilter(
			'wrapWith',
			(content, tag) => `<${tag}>${content}</${tag}>`
		);

		configApi.addFilter('pageUrlCompare', function (url) {
			return url === this.page.url;
		});
	},
});

test('transforms string with built-in method', async () => {
	const page = results.find(({ url }) => url === '/basic/');
	await expect(page.content).toMatchFileSnapshot(
		'./__snapshots__/filters-basic.html'
	);
});

test('transforms string with passed arguments', async () => {
	const page = results.find(({ url }) => url === '/with-arguments/');
	await expect(page.content).toMatchFileSnapshot(
		'./__snapshots__/filters-arguments.html'
	);
});

test('verify page context in scoped data', async () => {
	const page = results.find(({ url }) => url === '/with-this/');
	expect(page.content).toBe('true\n');
});
