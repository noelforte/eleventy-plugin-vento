import { expect, test } from 'vitest';
import { runBuild } from '#test-instance';

const results = await runBuild(import.meta.dirname);

test('renders a basic template', async () => {
	const page = results[0];
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/template-basic.html');
});
