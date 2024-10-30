import { EleventyTest } from './_eleventy-test-instance.js';
import { test } from 'vitest';

const matrix = [
	{
		label: 'All tags',
		autotrim: true,
		slug: 'all',
	},
	{
		label: 'Single tag',
		autotrim: ['set'],
		slug: 'default-single',
	},
	{
		label: 'All tags (with extends)',
		autotrim: ['@vento', 'tag1', 'tag2'],
		slug: 'default-extends',
	},
	{ label: 'Single custom tag', autotrim: ['button'], slug: 'custom-single' },
	{
		label: 'All custom tags (with extends)',
		autotrim: ['@11ty', 'tag1', 'tag2'],
		slug: 'custom-extends',
	},
];

test.for(matrix)('%s', async ({ autotrim, slug }, { expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-autotrim/', {
		pluginOptions: { autotrim },
	});

	await testInstance.rebuild();

	const { content } = testInstance.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot(`./_results/autotrim-${slug}.html`);
});
