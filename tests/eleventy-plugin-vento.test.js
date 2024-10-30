import { EleventyTest } from './_eleventy-test-instance.js';
import { describe, test } from 'vitest';

const testInstance = new EleventyTest('./tests/stubs/');

await testInstance.rebuild();

describe('Can print Eleventy data', { concurrent: true }, () => {
	const matrix = [
		['Static data', 'static'],
		['Computed data', 'computed'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const { content } = testInstance.getBuildResultForUrl(`/data-handling/${slug}/`);
		await expect(content).toMatchFileSnapshot(`./_results/data-${slug}.html`);
	});
});

describe("Can include from Eleventy's `includes` directory", { concurrent: true }, () => {
	const matrix = [
		['Without data', 'without-data'],
		['With data', 'with-data'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const { content } = testInstance.getBuildResultForUrl(`/include-handling/${slug}/`);
		await expect(content).toMatchFileSnapshot(`./_results/includes-${slug}.html`);
	});
});

describe("Can use layouts from Eleventy's `layouts` directory", { concurrent: true }, () => {
	const matrix = [
		['Example 1', 'example-1'],
		['Example 2', 'example-2'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const { content } = testInstance.getBuildResultForUrl(`/layout-handling/${slug}/`);
		await expect(content).toMatchFileSnapshot(`./_results/layouts-${slug}.html`);
	});
});

describe('Can process Eleventy permalink keys', { concurrent: true }, () => {
	test('render a page at a nested permalink', async ({ expect }) => {
		const { content } = testInstance.getBuildResultForUrl('/page/at/nested/permalink/');
		await expect(content).toMatchFileSnapshot('./_results/permalink-nested.html');
	});

	test('render a page at root url', async ({ expect }) => {
		const { content } = testInstance.getBuildResultForUrl('/');
		await expect(content).toMatchFileSnapshot('./_results/permalink-root.html');
	});

	test('render a page at a dynamic permalink', async ({ expect }) => {
		const { content } = testInstance.getBuildResultForUrl('/directory-data-test-page.html');
		expect(content).toBeDefined();
	});

	test('render a page at a dynamic permalink (js)', async ({ expect }) => {
		const { content } = testInstance.getBuildResultForUrl('/directory-data-test-page-js.html');
		expect(content).toBeDefined();
	});

	test('skips rendering a file', async ({ expect }) => {
		const skipped = testInstance.getPageWithInput('\nLeave me out of this.\n');

		expect(skipped.url).toBe(false);
	});
});

describe('Can run Vento filters', { concurrent: true }, () => {
	const matrix = [
		['Built-in methods', 'built-in'],
		['Chained methods', 'complex'],
		['Custom filter', 'custom'],
	];

	test.for(matrix)('%s', async ([_label, slug], { expect }) => {
		const { content } = testInstance.getBuildResultForUrl(`/filters/${slug}/`);
		await expect(content).toMatchFileSnapshot(`./_results/filters-${slug}.html`);
	});

	test('use context data (this.page)', async ({ expect }) => {
		const result = [
			testInstance.getBuildResultForUrl('/filters/with-this-example-1/'),
			testInstance.getBuildResultForUrl('/filters/with-this-example-2/'),
		].every(({ content }) => content === 'true');

		expect(result).toBe(true);
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
		const { content } = testInstance.getBuildResultForUrl(`/shortcodes/${slug}/`);
		await expect(content).toMatchFileSnapshot(`./_results/shortcodes-${slug}.html`);
	});
});
