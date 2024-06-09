import { runBuild } from '../get-instance.js';
import { expect, test } from 'vitest';

const [trimSingle, trimAll] = await Promise.all([
	runBuild(import.meta.dirname, { vento: { trimTags: ['set'] } }),
	runBuild(import.meta.dirname, { vento: { trimTags: true } }),
]);

test('trim a single tag', async () => {
	const page = trimSingle[0];
	expect(page.content).toMatchSnapshot();
});

test('trim a single tag', async () => {
	const page = trimAll[0];
	expect(page.content).toMatchSnapshot();
});
