import { EleventyTest } from '#11ty-test';
import { test } from 'vitest';

const testRun = new EleventyTest('./basic/');

await testRun.rebuild();

test('basic template', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/pages/');
	await expect(content).toMatchFileSnapshot('./_results/basic.html');
});
