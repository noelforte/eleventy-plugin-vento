import { runBuild } from '../get-instance.js';
import { expect, test } from 'vitest';

const results = await runBuild(import.meta.dirname);

test('render a page at a nested permalink', async () => {
	const page = results.find(({ url }) => url === '/page/at/nested/permalink/');
	expect(page.content).toMatchSnapshot();
});

test('render a page at root url', async () => {
	const page = results.find(({ url }) => url === '/');
	expect(page.content).toMatchSnapshot();
});

test('render a page at a dynamic permalink', async () => {
	const page = results.find(
		({ url }) => url === '/directory-data-test-page.html'
	);

	expect(page).toBeDefined();
});

test('skips rendering a file', () => {
	const writtenTemplates = results.filter(({ url }) => Boolean(url));
	expect(writtenTemplates.length).toMatchSnapshot();
});
