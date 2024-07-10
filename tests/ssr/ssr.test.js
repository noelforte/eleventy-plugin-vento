import { expect, test } from 'vitest';
import { runBuild } from '#test-instance';

const results = await runBuild(import.meta.dirname);

test('render if', async () => {
	const page = results.find(({ url }) => url === '/if/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/ssr-if.html');
});

test('render data', async () => {
	const page = results.find(({ url }) => url === '/data/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/ssr-data.html');
});

test('render for', async () => {
	const page = results.find(({ url }) => url === '/for/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/ssr-for.html');
});

test('render echo', async () => {
	const page = results.find(({ url }) => url === '/echo/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/ssr-echo.html');
});

test('render exec', async () => {
	const page = results.find(({ url }) => url === '/exec/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/ssr-exec.html');
});
