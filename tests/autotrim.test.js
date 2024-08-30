import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

test('trim a single tag', async ({ expect }) => {
	const testRun = new EleventyTest('./autotrim/', { vento: { autotrim: { tags: ['set'] } } });
	const { content } = await testRun.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-single.html');
});

test('trim all tags', async ({ expect }) => {
	const testRun = new EleventyTest('./autotrim/', { vento: { autotrim: true } });
	const { content } = await testRun.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-all.html');
});

test('trim all tags (extended)', async ({ expect }) => {
	const testRun = new EleventyTest('./autotrim/', {
		vento: { autotrim: { extend: true, tags: [] } },
	});
	const { content } = await testRun.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-extends.html');
});
