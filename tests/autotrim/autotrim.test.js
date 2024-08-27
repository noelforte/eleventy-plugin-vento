import { expect, test } from 'vitest';
import { runBuild } from '#test-instance';

const [trimSingle, trimAll, trimExtends] = await Promise.all([
	runBuild(import.meta.dirname, { vento: { autotrim: { tags: ['set'] } } }),
	runBuild(import.meta.dirname, { vento: { autotrim: true } }),
	runBuild(import.meta.dirname, {}),
]);

test('should trim a single tag', async () => {
	const page = trimSingle[0];
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/autotrim-single.html');
});

test('should trim all tags', async () => {
	const page = trimAll[0];
	await expect(page.content).toMatchFileSnapshot('./__snapshots__/autotrim-all.html');
});

// test('should trim all tags with an extra option', async () => {
// 	const page = trimExtends[0];
// 	await expect(page.content).toMatchFileSnapshot('./__snapshots__/autotrim-extends.html');
// });
