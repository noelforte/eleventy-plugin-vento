import process from 'node:process';
import { $, echo, fs, chalk } from 'zx';

const pkg = await fs.readJSON('./package.json');

const latestTag = await $`git describe --tags --abbrev=0`;

echo(
	chalk.dim('[generate-changesets]'),
	chalk.blue(`Checking for renovate commits since ${latestTag.valueOf()} tag...`)
);

const writeChangesets = await Promise.all(
	Object.keys(pkg.dependencies).map(async (dependencyName) => {
		const flags = ['-1', '--pretty=format:commit %h%n%an%n%n%B', '-G', `"${dependencyName}":`];

		const lastCommit = await $`git log ${flags} ${latestTag}..HEAD package.json`;
		const match = /commit (?<hash>[\da-f]+)\n(?<author>[^\n]+)\n\n(?<message>.+)/s.exec(
			lastCommit.stdout
		).groups;

		if (match.author !== 'renovate[bot]') {
			echo(chalk.dim(`[generate-changesets] No renovate commits found for "${dependencyName}"`));
			return;
		}

		echo(
			chalk.dim('[generate-changesets]'),
			chalk.green(`Found update for ${dependencyName} at ${match.hash}`)
		);

		await fs.writeFile(
			`./.changeset/z_dependencies_${dependencyName}.md`,
			`---\n'eleventy-plugin-vento': minor\n---\n\n${match.message}`
		);

		return true;
	})
);

echo(chalk.dim(`[generate-changesets] Wrote ${writeChangesets.filter(Boolean).length} file(s).`));

if (writeChangesets.length > 0 && process.env['GITHUB_OUTPUT']) {
	await $`echo "generated=true" >> $GITHUB_OUTPUT`;
} else if (process.env['GITHUB_OUTPUT']) {
	await $`echo "generated=false" >> $GITHUB_OUTPUT`;
}
