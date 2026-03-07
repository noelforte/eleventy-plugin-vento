import { describe, test } from 'vitest';
import { EleventyTest } from './_eleventy-test-instance.js';

describe('can handle template errors', { concurrent: true }, () => {
	const matrix = [
		['Missing closing tag', 'missing-closing-tag', 'Missing closing tag ("/for" tag is expected)'],
		[
			'Missing variable',
			'missing-variable',
			"Cannot read properties of undefined (reading 'notaproperty')",
		],
	];

	test.for(matrix)('%s', async ([_label, slug, message], { expect }) => {
		const testInstance = new EleventyTest(`./tests/stubs-vento-errors/${slug}.vto`);
		const error = await testInstance.rebuild().catch((error) => error);

		expect(error).toMatchObject({
			originalError: {
				originalError: {
					cause: {
						message: expect.stringContaining(message),
					},
				},
			},
		});
	});
});
