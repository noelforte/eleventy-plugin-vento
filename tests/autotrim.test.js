import { EleventyTest } from './_eleventy-test-instance.js';
import { test } from 'vitest';

test('trim all tags', async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-autotrim/', {
		pluginOptions: { autotrim: true },
	});

	const { content } = await testInstance.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-all.html');
});

test('trim a single tag', async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-autotrim/', {
		pluginOptions: { autotrim: ['set'] },
	});

	const { content } = await testInstance.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-default-single.html');
});

test('trim all default tags (extends)', async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-autotrim/', {
		pluginOptions: { autotrim: ['@vento', 'tag1', 'tag2'] },
	});

	const { content } = await testInstance.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot('./_results/autotrim-default-extends.html');
});

test('trim a single custom tag', async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-autotrim/', {
		pluginOptions: { autotrim: ['button'] },
	});

	const { content } = await testInstance.getBuildResultForUrl('/');
	await expect(content).toMatchFileSnapshot('./_results/autotrim-custom-single.html');
});

test('trim all custom tags (extends)', async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-autotrim/', {
		pluginOptions: { autotrim: ['@11ty', 'tag1', 'tag2'] },
	});

	const { content } = await testInstance.getBuildResultForUrl('/');
	await expect(content).toMatchFileSnapshot('./_results/autotrim-custom-extends.html');
});
