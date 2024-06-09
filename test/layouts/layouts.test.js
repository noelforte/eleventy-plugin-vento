import { runBuild } from '../get-instance.js';
import { expect, test } from 'vitest';

const results = await runBuild(import.meta.dirname);

test('render page with example layout 1', () => {
	const page = results.find(({ url }) => url === '/page1/');
	expect(page.content).toMatchSnapshot();
});

test('render page with example layout 2', () => {
	const page = results.find(({ url }) => url === '/page2/');
	expect(page.content).toMatchSnapshot();
});
