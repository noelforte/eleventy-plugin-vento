import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./shortcodes/', {
	useEleventyConfig: true,
});

test('run single shortcodes', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/single/');
	await expect(content).toMatchFileSnapshot('./_results/shortcodes-single.html');
});

test('run single shortcodes with filters', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/single-filters/');
	await expect(content).toMatchFileSnapshot('./_results/shortcodes-single-filters.html');
});

test('run paired shortcodes', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/paired/');
	await expect(content).toMatchFileSnapshot('./_results/shortcodes-paired.html');
});

test('run paired shortcodes with filters', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/paired-filters/');
	await expect(content).toMatchFileSnapshot('./_results/shortcodes-paired-filters.html');
});

test('verify nested shortcodes and text can compile together', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/paired-nested/');
	await expect(content).toMatchFileSnapshot('./_results/shortcodes-paired-nested.html');
});
