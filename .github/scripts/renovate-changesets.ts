import process from 'node:process';
import path from 'path';
import type { PackageJson } from 'type-fest';
import { $, chalk, echo, fs } from 'zx';

function exit(message: string, code = 0, color?: typeof chalk) {
	echo(color ? color(message) : message);
	process.stdout.write('\n');
	process.exit(code);
}

// Config
const dependencies = ['debug', 'ventojs'];

// Get package.json information
const pkg: PackageJson = fs.readJSONSync('./package.json');

// Get file diffs
echo(chalk.dim('Diffing changes...'));
const diffOutput = await $`git diff --stat --name-only HEAD~1`;
const diffFiles = diffOutput.stdout.split('\n');

if (!diffFiles.includes('package.json')) {
	exit('`package.json` not modified in latest commit', 0, chalk.red);
}

// Create a map for bumped package versions
echo(chalk.dim('Indexing changes...'));
const bumpedVersions: Map<string, string> = new Map();
const changes = await $`git show --format='' package.json`;

process.stdout.write('\n');

for (const change of changes.stdout.split('\n')) {
	const match = /^\+.*"(.+)": ?"([\d.]+)"/m.exec(change);

	if (match?.[1] && match?.[2]) {
		bumpedVersions.set(match[1], match[2]);
	}
}

for (const [name, version] of bumpedVersions) {
	echo`${chalk.blue(name)} was updated to ${chalk.green(version)}`;

	if (!dependencies.includes(name)) {
		bumpedVersions.delete(name);
	}
}

process.stdout.write('\n');

if (bumpedVersions.size === 0) {
	exit('No changesets to write.', 0, chalk.dim);
}

process.stdout.write(chalk.dim(`Writing ${bumpedVersions.size} changeset file(s) ... `));
const writers = Array.from(bumpedVersions, async ([name, version]) => {
	const filepath = path.join('.changeset', `00-renovate-update-${name}.md`);
	const contents = `---\n'eleventy-plugin-vento': minor\n---\n\nUpdate \`${name}\` to ${version}`;

	return fs.promises.writeFile(filepath, contents, 'utf8');
});

await Promise.all(writers);

process.stdout.write(chalk.dim('[ ') + chalk.green('DONE') + chalk.dim(' ]\n'));

echo(chalk.dim('Staging changes...'));
$`git add .changeset`;

echo(chalk.dim('Committing...'));
$`git commit --author='github-actions[bot] <github-actions[bot]@users.noreply.github.com>' -m 'Add changesets for renovate changes'`;

echo(chalk.dim('Pushing changes...'));
$`git push`;

process.stdout.write('\n');
