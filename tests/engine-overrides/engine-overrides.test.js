import { expect, test } from 'vitest';
import { runBuild } from '#test-instance';

export const results = await runBuild(import.meta.dirname);

test('renders markdown file with Vento', async () => {
	const page = results.find(({ url }) => url === '/as-md-engine/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/as-md-engine.html');
});

test('renders html file with Vento', async () => {
	const page = results.find(({ url }) => url === '/as-html-engine/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/as-html-engine.html');
});
