import { EleventyTest } from '#11ty-test';
import { test } from 'vitest';

const testRun = new EleventyTest('./ignore-tag/', {
	pluginOptions: {
		ignoreTag: true,
	},
});

test('render if (ignore tag)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/if/');
	await expect(content).toMatchFileSnapshot('./_results/ignore-if.html');
});

test('render data (ignore tag)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/data/');
	await expect(content).toMatchFileSnapshot('./_results/ignore-data.html');
});

test('render for (ignore tag)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/for/');
	await expect(content).toMatchFileSnapshot('./_results/ignore-for.html');
});

test('render echo (ignore tag)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/echo/');
	await expect(content).toMatchFileSnapshot('./_results/ignore-echo.html');
});

test('render exec (ignore tag)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/exec/');
	await expect(content).toMatchFileSnapshot('./_results/ignore-exec.html');
});
