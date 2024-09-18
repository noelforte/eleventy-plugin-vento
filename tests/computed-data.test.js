import { EleventyTest } from './_eleventy-test.js';
import { test } from 'vitest';

const testRun = new EleventyTest('./computed-data/');

test('renders computed data from local key', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/');
	await expect(content).toMatchFileSnapshot('./_results/computed-data.html');
});