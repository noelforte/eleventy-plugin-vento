import { EleventyTest } from '#11ty-test';
import { test } from 'vitest';

const testRun = new EleventyTest('./permalinks/');

await testRun.rebuild();

test('render a page at a nested permalink', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/page/at/nested/permalink/');
	await expect(content).toMatchFileSnapshot('./_results/permalink-nested.html');
});

test('render a page at root url', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/');
	await expect(content).toMatchFileSnapshot('./_results/permalink-root.html');
});

test('render a page at a dynamic permalink', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/directory-data-test-page.html');
	expect(content).toBeDefined();
});

test('render a page at a dynamic permalink (js)', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/directory-data-test-page-js.html');
	expect(content).toBeDefined();
});

test('skips rendering a file', async ({ expect }) => {
	expect(testRun.countResultPages()).resolves.toBe(4);
});
