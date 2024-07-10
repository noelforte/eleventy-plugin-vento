import { expect, test } from 'vitest';
import { runBuild } from '#test-instance';

const results = await runBuild(import.meta.dirname);

test('render page with example layout 1', async () => {
	const page = results.find(({ url }) => url === '/page1/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/example-layout-1.html');
});

test('render page with example layout 2', async () => {
	const page = results.find(({ url }) => url === '/page2/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/example-layout-2.html');
});
