import { test } from 'vitest';
import { EleventyTest } from './_eleventy-test-instance.js';

const testInstance = new EleventyTest('./tests/stubs-vento-syntax/', {
	pluginOptions: {
		autotrim: true,
	},
});

await testInstance.rebuild();

const matrix: [string, string][] = [
	['Can set/print variables', 'set'],
	['Can run functions', 'function'],
	['Can iterate through loops', 'for'],
	['Can print exported values', 'export'],
	['Can print imported values', 'import'],
];

test.for(matrix)('%s in templates', async ([_label, slug], { expect }) => {
	const result = testInstance.getBuildResultForUrl(`/${slug}/`);
	await expect(result?.content).toMatchFileSnapshot(`./snapshots/vento-syntax-${slug}.htmlsnap`);
});
