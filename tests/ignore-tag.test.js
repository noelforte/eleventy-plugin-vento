import { EleventyTest } from './_eleventy-test-instance.js';
import { describe, test } from 'vitest';

const testInstance = new EleventyTest('./tests/stubs-ignore-tag/', {
	pluginOptions: {
		ignoreTag: true,
	},
});

await testInstance.rebuild();

const matrix = ['if', 'data', 'for', 'echo', 'exec'];

describe('Can skip tags with `{{! ... }}` syntax', { concurrent: true }, () => {
	test.for(matrix)('Ignore %s', async (tag, { expect }) => {
		const { content } = testInstance.getBuildResultForUrl(`/${tag}/`);
		await expect(content).toMatchFileSnapshot(`./_results/ignore-${tag}.html`);
	});
});
