import { EleventyTest } from '#11ty-test';
import { test } from 'vitest';

const testRun = new EleventyTest('./filters/');

await testRun.rebuild();

test('transform string with built-ins', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/basic/');
	await expect(content).toMatchFileSnapshot('./_results/filters-built-in-basic.html');
});

test('transform string with multiple methods', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/complex/');
	await expect(content).toMatchFileSnapshot('./_results/filters-built-in-complex.html');
});

test('transforms string with custom filter', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/custom/');
	await expect(content).toMatchFileSnapshot('./_results/filters-arguments.html');
});

test('transform string using context data (this.page)', async ({ expect }) => {
	const result = [
		await testRun.getBuildResultForUrl('/with-this-example-1/'),
		await testRun.getBuildResultForUrl('/with-this-example-2/'),
	].every(({ content }) => content === 'true');

	expect(result).toBe(true);
});
