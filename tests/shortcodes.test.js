import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./shortcodes/');

test('shortcode without argument', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/basic/');
	expect(content).toBe('Hello world!\n');
});

test('shortcode with arguments', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/with-arguments/');
	await expect(content).toMatchFileSnapshot('./_results/shortcodes-arguments.html');
});
