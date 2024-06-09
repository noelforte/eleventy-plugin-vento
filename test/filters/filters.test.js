import { runBuild } from '../get-instance.js';
import { expect, test } from 'vitest';

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

test('transform string with built-in method', () => {
	const page = results.find(({ url }) => url === '/basic/');
	expect(page.content).toMatchSnapshot();
});

test('transform string with passed arguments', () => {
	const page = results.find(({ url }) => url === '/with-arguments/');
	expect(page.content).toMatchSnapshot();
});

test('verify page context in scoped data', () => {
	const page = results.find(({ url }) => url === '/with-this/');
	expect(page.content).toBe('true\n');
});
