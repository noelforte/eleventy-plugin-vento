import { EleventyTest } from './_eleventy-test-instance.js';
import { test } from 'vitest';

const testInstance = new EleventyTest('./tests/stubs-name-collisions/');

await testInstance.rebuild();

const matrix = [
	['paired forward', 'paired-forward'],
	['paired reverse', 'paired-reverse'],
	['single forward', 'single-forward'],
	['single reverse', 'single-reverse'],
];

test.for(matrix)(
	'Naming collisions (%s)',
	{ concurrent: true },
	async ([_label, format], { expect }) => {
		const result = testInstance.getBuildResultForUrl(format);
		await expect(result?.content).toMatchFileSnapshot(`./snapshots/collisions-${format}.htmlsnap`);
	}
);
