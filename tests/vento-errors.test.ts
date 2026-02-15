import { bench, test } from 'vitest';
import { EleventyTest } from './_eleventy-test-instance.js';

test('error', { concurrent: true }, async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-vento-errors/');
	const error = await testInstance.rebuild().catch((error) => error);
	expect(error.originalError.message).toContain('tests/stubs-vento-errors/missing-variable.vto:10:2');
	expect(error.originalError.message).toContain('{{- k.notaproperty }}');
	expect(error.originalError.message).not.toContain('<head>');
});
