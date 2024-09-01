import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

test('trim a single tag', async ({ expect }) => {
	const testRun = new EleventyTest('./autotrim/', {
		pluginOptions: { autotrim: { tags: ['set'] } },
	});
	const { content } = await testRun.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-single.html');
});

test('trim all tags', async ({ expect }) => {
	const testRun = new EleventyTest('./autotrim/', { pluginOptions: { autotrim: true } });
	const { content } = await testRun.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-all.html');
});

test('trim all tags (extended)', async ({ expect }) => {
	const testRun = new EleventyTest('./autotrim/', {
		pluginOptions: { autotrim: { extend: true, tags: ['tag1', 'tag2'] } },
	});
	const { content } = await testRun.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-extends.html');
});
