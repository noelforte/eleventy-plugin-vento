import { expect, test } from 'vitest';
import { runBuild } from '#test-instance';

const results = await runBuild(import.meta.dirname);

test('renders computed data from local key', async () => {
	const page = results.find(({ url }) => url === '/from-local-key/');
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/from-local-key.html');
});
