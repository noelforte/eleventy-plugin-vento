import { describe, test } from 'vitest';
import { EleventyTest } from './_eleventy-test-instance.js';

const testInstance = new EleventyTest('./tests/stubs/');

await testInstance.rebuild();

describe('Can print Eleventy data', { concurrent: true }, () => {
	const matrix = [
		['Static data', 'static'],
		['Computed data', 'computed'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/data-handling/${slug}/`);
		await expect(result?.content).toMatchFileSnapshot(`./snapshots/data-${slug}.htmlsnap`);
	});
});

describe("Can include from Eleventy's `includes` directory", { concurrent: true }, () => {
	const matrix = [
		['Without data', 'without-data'],
		['With data', 'with-data'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/include-handling/${slug}/`);
		await expect(result?.content).toMatchFileSnapshot(`./snapshots/includes-${slug}.htmlsnap`);
	});
});

describe("Can use layouts from Eleventy's `layouts` directory", { concurrent: true }, () => {
	const matrix = [
		['Example 1', 'example-1'],
		['Example 2', 'example-2'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/layout-handling/${slug}/`);
		await expect(result?.content).toMatchFileSnapshot(`./snapshots/layouts-${slug}.htmlsnap`);
	});
});

describe('Can process Eleventy permalink keys', { concurrent: true }, () => {
	test('render a page at a nested permalink', async ({ expect }) => {
		const result = testInstance.getBuildResultForUrl('/page/at/nested/permalink/');
		await expect(result?.content).toMatchFileSnapshot('./snapshots/permalink-nested.htmlsnap');
	});

	test('render a page at root url', async ({ expect }) => {
		const result = testInstance.getBuildResultForUrl('/');
		await expect(result?.content).toMatchFileSnapshot('./snapshots/permalink-root.htmlsnap');
	});

	test('render a page at a dynamic permalink', async ({ expect }) => {
		const result = testInstance.getBuildResultForUrl('/directory-data-test-page.html');
		expect(result?.content).toBeDefined();
	});

	test('render a page at a dynamic permalink (js)', async ({ expect }) => {
		const result = testInstance.getBuildResultForUrl('/directory-data-test-page-js.html');
		expect(result?.content).toBeDefined();
	});

	test('skips rendering a file', async ({ expect }) => {
		const skipped = testInstance.getPageWithInput('\nLeave me out of this.\n');

		expect(skipped?.url).toBe(false);
	});
});

describe('Can run Vento filters', { concurrent: true }, () => {
	const matrix = [
		['Built-in methods', 'built-in'],
		['Chained methods', 'complex'],
		['Custom filter', 'custom'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/filters/${slug}/`);
		await expect(result?.content).toMatchFileSnapshot(`./snapshots/filters-${slug}.htmlsnap`);
	});

	test('use context data (this.page)', async ({ expect }) => {
		const result = [
			testInstance.getBuildResultForUrl('/filters/with-this-example-1/'),
			testInstance.getBuildResultForUrl('/filters/with-this-example-2/'),
		].every((result) => result?.content === 'true');

		expect(result).toBe(true);
	});

	test('use context env (this.env)', async ({ expect }) => {
		const result = testInstance.getBuildResultForUrl('/filters/with-env-compile/');
		expect(result?.content).toBe('4');
	});
});

describe('Can run Eleventy shortcodes as Vento tags', { concurrent: true }, () => {
	const matrix = [
		['single shortcodes', 'single'],
		['single shortcodes with filters', 'single-filters'],
		['paired shortcodes', 'paired'],
		['paired shortcodes with filters', 'paired-filters'],
		['nested shortcodes with adjacent content', 'paired-nested'],
	];

	test.for(matrix)('run %s', async ([_label, slug], { expect }) => {
		const result = testInstance.getBuildResultForUrl(`/shortcodes/${slug}/`);
		await expect(result?.content).toMatchFileSnapshot(`./snapshots/shortcodes-${slug}.htmlsnap`);
	});
});

test('Can access collection data within templates', { concurrent: true }, async ({ expect }) => {
	const result = testInstance.getBuildResultForUrl(`/collections/iterate/`);
	await expect(result?.content).toMatchFileSnapshot(`./snapshots/collections-iterate.htmlsnap`);
});
