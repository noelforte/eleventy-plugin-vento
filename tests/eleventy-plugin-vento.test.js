import { EleventyTest } from '#11ty-test';
import { describe, test } from 'vitest';

const testInstance = new EleventyTest('./tests/stubs/');

await testInstance.rebuild();

// console.log(testInstance.buildResults);

describe('Can print Eleventy data', { concurrent: true }, () => {
	test('Static data', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/data-handling/static/');
		await expect(content).toMatchFileSnapshot('./_results/basic.html');
	});

	test('Computed data', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/data-handling/computed/');
		await expect(content).toMatchFileSnapshot('./_results/computed-data.html');
	});
});

describe('Can run Vento filters', { concurrent: true }, () => {
	test('Built-ins', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/filters/basic/');
		await expect(content).toMatchFileSnapshot('./_results/filters-built-in-basic.html');
	});

	test('Multiple methods', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/filters/complex/');
		await expect(content).toMatchFileSnapshot('./_results/filters-built-in-complex.html');
	});

	test('Custom filter', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/filters/custom/');
		await expect(content).toMatchFileSnapshot('./_results/filters-arguments.html');
	});

	test('Use context data (this.page)', async ({ expect }) => {
		const result = [
			await testInstance.getBuildResultForUrl('/filters/with-this-example-1/'),
			await testInstance.getBuildResultForUrl('/filters/with-this-example-2/'),
		].every(({ content }) => content === 'true');

		expect(result).toBe(true);
	});
});

describe("Can include from Eleventy's `includes` directory", { concurrent: true }, () => {
	test('Without data', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/include-handling/basic/');
		await expect(content).toMatchFileSnapshot('./_results/includes-basic.html');
	});

	test('With data', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/include-handling/with-data/');
		await expect(content).toMatchFileSnapshot('./_results/includes-data.html');
	});
});

describe("Can use layouts from Eleventy's `layouts` directory", { concurrent: true }, () => {
	test('Example layout 1', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/layout-handling/page1/');
		await expect(content).toMatchFileSnapshot('./_results/layouts-example-1.html');
	});

	test('Example layout 2', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/layout-handling/page2/');
		await expect(content).toMatchFileSnapshot('./_results/layouts-example-2.html');
	});
});

describe('Can process Eleventy permalink keys', { concurrent: true }, () => {
	test('render a page at a nested permalink', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/page/at/nested/permalink/');
		await expect(content).toMatchFileSnapshot('./_results/permalink-nested.html');
	});

	test('render a page at root url', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/');
		await expect(content).toMatchFileSnapshot('./_results/permalink-root.html');
	});

	test('render a page at a dynamic permalink', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/directory-data-test-page.html');
		expect(content).toBeDefined();
	});

	test('render a page at a dynamic permalink (js)', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl(
			'/directory-data-test-page-js.html'
		);
		expect(content).toBeDefined();
	});

	test('skips rendering a file', async ({ expect }) => {
		const skipped = await testInstance.getPageWithInput('\nLeave me out of this.\n');

		expect(skipped.url).toBe(false);
	});
});

describe('Can run Eleventy shortcodes as Vento tags', { concurrent: true }, () => {
	test('run single shortcodes', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/shortcodes/single/');
		await expect(content).toMatchFileSnapshot('./_results/shortcodes-single.html');
	});

	test('run single shortcodes with filters', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/shortcodes/single-filters/');
		await expect(content).toMatchFileSnapshot('./_results/shortcodes-single-filters.html');
	});

	test('run paired shortcodes', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/shortcodes/paired/');
		await expect(content).toMatchFileSnapshot('./_results/shortcodes-paired.html');
	});

	test('run paired shortcodes with filters', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/shortcodes/paired-filters/');
		await expect(content).toMatchFileSnapshot('./_results/shortcodes-paired-filters.html');
	});

	test('verify nested shortcodes and text can compile together', async ({ expect }) => {
		const { content } = await testInstance.getBuildResultForUrl('/shortcodes/paired-nested/');
		await expect(content).toMatchFileSnapshot('./_results/shortcodes-paired-nested.html');
	});
});
