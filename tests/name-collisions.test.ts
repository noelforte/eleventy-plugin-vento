import { describe, test } from 'vitest';
import { EleventyTest } from './_eleventy-test-instance.js';

const testInstance = new EleventyTest('./tests/stubs-name-collisions/');

await testInstance.rebuild();

describe('Can handle paired shortcode name overlap', { concurrent: true }, () => {
	const matrix = ['forward', 'reverse'];

	test.for(matrix)('Can handle %s overlap', { concurrent: true }, async (direction, { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/paired-${direction}/`);
		await expect(result?.content).toMatchFileSnapshot(
			`./snapshots/collisions-paired-${direction}.htmlsnap`
		);
	});
});

describe('Can handle single shortcode name overlap', { concurrent: true }, () => {
	const matrix = ['forward', 'reverse'];

	test.for(matrix)('Can handle %s overlap', { concurrent: true }, async (direction, { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/single-${direction}/`);
		await expect(result?.content).toMatchFileSnapshot(
			`./snapshots/collisions-single-${direction}.htmlsnap`
		);
	});
});
