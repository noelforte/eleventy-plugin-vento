import { test } from 'vitest';
import { EleventyTest } from './_eleventy-test-instance.js';

test('can autoescape in templates', { concurrent: true }, async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-vento-options/autoescape/', {
		pluginOptions: {
			ventoOptions: {
				autoescape: true,
			},
		},
	});
	await testInstance.rebuild();

	const result = testInstance.getBuildResultForUrl(`/`);
	await expect(result?.content).toMatchFileSnapshot(`./__snapshots__/options-autoescape.html.snap`);
});

test('can disable autoDataVarname', { concurrent: true }, async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-vento-options/no-auto-datavarname/', {
		pluginOptions: { ventoOptions: { autoDataVarname: false } },
	});
	await testInstance.rebuild();

	const result = testInstance.getBuildResultForUrl(`/`);
	expect(result?.content).toBe('Hello World!');
});

test('can change dataVarname', { concurrent: true }, async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-vento-options/change-datavarname/', {
		pluginOptions: { ventoOptions: { dataVarname: 'global', autoDataVarname: false } },
	});
	await testInstance.rebuild();

	const result = testInstance.getBuildResultForUrl(`/`);
	expect(result?.content).toBe('Hello World!');
});

test('should fail in strict mode', { concurrent: true }, async ({ expect }) => {
	const testInstance = new EleventyTest('./tests/stubs-vento-options/strict/', {
		pluginOptions: { ventoOptions: { strict: true } },
	});

	const build = testInstance.rebuild();

	await expect(build).rejects.toThrowError();
});
