import { EleventyTest } from '#11ty-test';
import { test } from 'vitest';

const testRun = new EleventyTest('./engine-overrides/');

await testRun.rebuild();

test('use vento as html engine', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/as-html-engine/');
	await expect(content).toMatchFileSnapshot('./_results/override.html-engine.html');
});

test('use vento as markdown engine', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/as-md-engine/');
	await expect(content).toMatchFileSnapshot('./_results/override.md-engine.html');
});
