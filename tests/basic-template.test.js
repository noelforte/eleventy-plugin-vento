import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./basic/', {
	useEleventyConfig: true,
});

test('basic template', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/pages/');
	await expect(content).toMatchFileSnapshot('./_results/basic.html');
});
