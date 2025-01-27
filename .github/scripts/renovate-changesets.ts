import process from 'node:process';
import path from 'node:path';
import { promises as fsp } from 'node:fs';
import spawn from 'nano-spawn';
import pc from 'picocolors';
import { Except } from 'type-fest';
import type { Colors } from 'picocolors/types';
type ColorNames = keyof Except<Colors, 'isColorSupported'>;

function log(message: string, color?: ColorNames) {
	console.log(color ? pc[color](message) : message);
}

function exit(message: string, code = 0, color?: ColorNames) {
	log(message, color);
	process.stdout.write('\n');
	process.exit(code);
}

// Config
const dependencies = new Set(['debug', 'ventojs']);

// Get file diffs
log('Diffing changes...', 'dim');
const diffOutput = await spawn('git', ['diff', '--stat', '--name-only', 'HEAD~1']);
const diffFiles = diffOutput.stdout.split('\n');

if (!diffFiles.includes('package.json')) {
	exit('`package.json` not modified in latest commit', 0, 'red');
}

// Create a map for bumped package versions
log('Indexing changes...', 'dim');
const bumpedVersions: Map<string, string> = new Map();
const changes = await spawn('git', ['diff', 'HEAD~1', 'package.json']);

for (const change of changes.stdout.split('\n')) {
	const match = /^\+.*"(.+)": ?"([\d.]+)"/m.exec(change);

	if (match?.[1] && match?.[2]) {
		bumpedVersions.set(match[1], match[2]);
	}
}

for (const [name, version] of bumpedVersions) {
	log(`${pc.blue(name)} was updated to ${pc.green(version)}`);

	if (!dependencies.has(name)) {
		bumpedVersions.delete(name);
	}
}

if (bumpedVersions.size === 0) {
	exit('No changesets to write.', 0, 'red');
}

process.stdout.write(pc.dim(`Writing ${bumpedVersions.size} changeset file(s) ... `));
const writers = [...bumpedVersions].map(async ([name, version]) => {
	const filepath = path.join('.changeset', `00-renovate-update-${name}.md`);
	const contents = `---\n'eleventy-plugin-vento': minor\n---\n\nUpdate \`${name}\` to ${version}`;

	return await fsp.writeFile(filepath, contents, 'utf8');
});

await Promise.all(writers);

process.stdout.write(pc.dim('[ ') + pc.green('DONE') + pc.dim(' ]\n'));

if (process.env.CI !== 'true' || process.env.GITHUB_ACTIONS !== 'true') {
	exit('Not running on CI.', 0, 'red');
}

log('Staging changes...', 'dim');
await spawn('git', ['add', '.changeset']);

log('Committing...', 'dim');
await spawn('git', [
	'commit',
	'--author',
	'github-actions[bot] <github-actions[bot]@users.noreply.github.com>',
	'-m',
	'Add changesets for renovate updates',
]);

log('Pushing changes...', 'dim');
await spawn('git', ['push']);
