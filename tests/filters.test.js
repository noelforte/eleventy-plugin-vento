import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./filters/', {
	useEleventyConfig: true,
});

test('transform string with built-in method', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/basic/');
	await expect(content).toMatchFileSnapshot('./_results/filters-built-in.html');
});

test('transforms string with passed arguments', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/with-arguments/');
	await expect(content).toMatchFileSnapshot('./_results/filters-arguments.html');
});

test('verify page context in scoped data', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/with-this/');
	expect(content).toBe('true\n');
});
