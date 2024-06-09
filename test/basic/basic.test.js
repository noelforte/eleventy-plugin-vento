import { runBuild } from '../get-instance.js';
import { expect, test } from 'vitest';

const results = await runBuild(import.meta.dirname);

test('renders a basic template', async () => {
	await expect(results[0].content).toMatchSnapshot();
});
