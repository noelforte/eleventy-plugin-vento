import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./layouts/');

test('render page with example layout 1', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/page1/');
	await expect(content).toMatchFileSnapshot('./_results/layouts-example-1.html');
});

test('render page with example layout 2', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/page2/');
	await expect(content).toMatchFileSnapshot('./_results/layouts-example-2.html');
});
