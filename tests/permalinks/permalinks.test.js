import { expect, test } from 'vitest';
import { runBuild } from '#test-instance';

const results = await runBuild(import.meta.dirname);

test('render a page at a nested permalink', async () => {
	const page = results.find(({ url }) => url === '/page/at/nested/permalink/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/permalink-nested.html');
});

test('render a page at root url', async () => {
	const page = results.find(({ url }) => url === '/');
	expect(page.content).toMatchFileSnapshot('./__snapshots__/permalink-root.html');
});

test('render a page at a dynamic permalink', async () => {
	const page = results.find(({ url }) => url === '/directory-data-test-page.html');

	expect(page).toBeDefined();
});

test('render a page at a dynamic permalink with js', async () => {
	const page = results.find(({ url }) => url === '/directory-data-test-page-js.html');

	expect(page).toBeDefined();
});

test('skips rendering a file', () => {
	const writtenTemplates = results.filter(({ url }) => Boolean(url));
	expect(writtenTemplates.length).toBe(4);
});
