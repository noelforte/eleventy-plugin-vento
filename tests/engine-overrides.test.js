import { EleventyTest } from './_eleventy-test-instance.js';
import { describe, test } from 'vitest';

const testRun = new EleventyTest('./tests/stubs-engine-overrides/');

await testRun.rebuild();

describe('Can run .md files and .html file as Vento templates', { concurrent: true }, () => {
	test('use vento as html engine', async ({ expect }) => {
		const { content } = await testRun.getBuildResultForUrl('/as-html-engine/');
		await expect(content).toMatchFileSnapshot('./_results/override.html-engine.html');
	});

	test('use vento as markdown engine', async ({ expect }) => {
		const { content } = await testRun.getBuildResultForUrl('/as-md-engine/');
		await expect(content).toMatchFileSnapshot('./_results/override.md-engine.html');
	});
});
