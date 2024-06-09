import { expect, test } from 'vitest';
import { runBuild } from '../get-instance.js';

const [trimSingle, trimAll] = await Promise.all([
	runBuild(import.meta.dirname, { vento: { trimTags: ['set'] } }),
	runBuild(import.meta.dirname, { vento: { trimTags: true } }),
]);

test('should trim a single tag', async () => {
	const page = trimSingle[0];
	await expect(page.content).toMatchFileSnapshot(
		'./build/autotrim-single.html'
	);
});

test('should trim all tags', async () => {
	const page = trimAll[0];
	await expect(page.content).toMatchFileSnapshot('./build/autotrim-all.html');
});
