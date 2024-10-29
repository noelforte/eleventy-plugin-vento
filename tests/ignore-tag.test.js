import { EleventyTest } from './_eleventy-test-instance.js';
import { describe, test } from 'vitest';

const testRun = new EleventyTest('./tests/stubs-ignore-tag/', {
	pluginOptions: {
		ignoreTag: true,
	},
});

await testRun.rebuild();

describe('Can skip tags with `{{! ... }}` syntax', { concurrent: true }, () => {
	test('if', async ({ expect }) => {
		const { content } = await testRun.getBuildResultForUrl('/if/');
		await expect(content).toMatchFileSnapshot('./_results/ignore-if.html');
	});

	test('data', async ({ expect }) => {
		const { content } = await testRun.getBuildResultForUrl('/data/');
		await expect(content).toMatchFileSnapshot('./_results/ignore-data.html');
	});

	test('for', async ({ expect }) => {
		const { content } = await testRun.getBuildResultForUrl('/for/');
		await expect(content).toMatchFileSnapshot('./_results/ignore-for.html');
	});

	test('echo', async ({ expect }) => {
		const { content } = await testRun.getBuildResultForUrl('/echo/');
		await expect(content).toMatchFileSnapshot('./_results/ignore-echo.html');
	});

	test('exec', async ({ expect }) => {
		const { content } = await testRun.getBuildResultForUrl('/exec/');
		await expect(content).toMatchFileSnapshot('./_results/ignore-exec.html');
	});
});
