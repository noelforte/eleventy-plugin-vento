import { EleventyTest } from './_eleventy-test-instance.js';
import { describe, test } from 'vitest';

const testInstance = new EleventyTest('./tests/stubs-engine-overrides/');

await testInstance.rebuild();

const matrix = ['html', 'md'];

describe('Can run .md files and .html file as Vento templates', { concurrent: true }, () => {
	test.for(matrix)('Use Vento as `.%s` engine', async (ext, { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/as-${ext}-engine/`);
		expect(result?.content).toMatchSnapshot(`override-${ext}-engine`);
	});
});
