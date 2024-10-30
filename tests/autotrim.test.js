import { EleventyTest } from './_eleventy-test-instance.js';
import { test } from 'vitest';

const matrix = [
	['All tags', true, 'all'],
	['Single tag', ['set'], 'default-single'],
	['All tags (with extends)', ['@vento', 'tag1', 'tag2'], 'default-extends'],
	['Single custom tag', ['button'], 'custom-single'],
	['All custom tags (with extends)', ['@11ty', 'tag1', 'tag2'], 'custom-extends'],
];

test.for(matrix)('%s', async ([_label, autotrim, slug], { expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-autotrim/', {
		pluginOptions: { autotrim },
	});

	await testInstance.rebuild();

	const { content } = testInstance.getBuildResultForUrl('/');

	await expect(content).toMatchFileSnapshot(`./_results/autotrim-${slug}.html`);
});
