import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./ssr/');

test('render if (ssr)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/if/');
	await expect(content).toMatchFileSnapshot('./_results/ssr-if.html');
});

test('render data (ssr)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/data/');
	await expect(content).toMatchFileSnapshot('./_results/ssr-data.html');
});

test('render for (ssr)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/for/');
	await expect(content).toMatchFileSnapshot('./_results/ssr-for.html');
});

test('render echo (ssr)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/echo/');
	await expect(content).toMatchFileSnapshot('./_results/ssr-echo.html');
});

test('render exec (ssr)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/exec/');
	await expect(content).toMatchFileSnapshot('./_results/ssr-exec.html');
});
