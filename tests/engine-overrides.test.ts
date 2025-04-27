import { EleventyTest } from './_eleventy-test-instance.js';
import { test } from 'vitest';

const testInstance = new EleventyTest('./tests/stubs-engine-overrides/');

await testInstance.rebuild();

const matrix = ['html', 'md'];

test.for(matrix)('Use Vento as `.%s` engine', { concurrent: true }, async (ext, { expect }) => {
	const result = testInstance.getBuildResultForUrl(`/as-${ext}-engine/`);
	await expect(result?.content).toMatchFileSnapshot(`./snapshots/override-${ext}-engine.html.snap`);
});
