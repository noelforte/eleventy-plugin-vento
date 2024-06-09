import { runBuild } from '../get-instance.js';
import { expect, test } from 'vitest';

console.log(import.meta.dirname);

const results = await runBuild(import.meta.dirname);

test('include a page', () => {
	const page = results.find(({ url }) => url === '/basic/');
	expect(page.content).toMatchSnapshot();
});

test('include a page with data passing', async () => {
	const page = results.find(({ url }) => url === '/with-data/');
	await expect(page.content).toMatchSnapshot();
});
