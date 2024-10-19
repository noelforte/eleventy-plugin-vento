import { EleventyTest } from '#11ty-test';
import { test } from 'vitest';

const testRun = new EleventyTest('./includes/');

test('include a page', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/basic/');
	await expect(content).toMatchFileSnapshot('./_results/includes-basic.html');
});

test('include a page with data passing', async ({ expect }) => {
	const { content } = await testRun.getBuildResultForUrl('/with-data/');
	await expect(content).toMatchFileSnapshot('./_results/includes-data.html');
});
