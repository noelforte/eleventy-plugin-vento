import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./engine-overrides/', {
	useEleventyConfig: true,
});

test('use vento as html engine', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/as-html-engine/');
	await expect(content).toMatchFileSnapshot('./_results/override.html-engine.html');
});

test('use vento as markdown engine', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/as-md-engine/');
	await expect(content).toMatchFileSnapshot('./_results/override.md-engine.html');
});
