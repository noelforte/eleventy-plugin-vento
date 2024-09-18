import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./filters/', {
	useEleventyConfig: true,
});

test('transform string with built-in method', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/basic/');
	await expect(content).toMatchFileSnapshot('./_results/filters-built-in-basic.html');
});

test('transform string with multiple methods', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/complex/');
	await expect(content).toMatchFileSnapshot('./_results/filters-built-in-complex.html');
});

test('transforms string with passed arguments', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/with-arguments/');
	await expect(content).toMatchFileSnapshot('./_results/filters-arguments.html');
});

test('verify page context in scoped data', async ({ expect }) => {
	const result = [
		await testRun.getBuildResultForUrl('/with-this-example-1/'),
		await testRun.getBuildResultForUrl('/with-this-example-2/'),
	].every(({ content }) => content === 'true');

	expect(result).toBeTruthy();
});
