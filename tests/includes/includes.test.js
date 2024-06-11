import { expect, test } from 'vitest';
import { runBuild } from '../get-instance.js';

const results = await runBuild(import.meta.dirname);

test('include a page', async () => {
	const page = results.find(({ url }) => url === '/basic/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/includes-basic.html');
});

test('include a page with data passing', async () => {
	const page = results.find(({ url }) => url === '/with-data/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/includes-data.html');
});
