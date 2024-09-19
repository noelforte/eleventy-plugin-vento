import { x } from 'tinyexec';
import { readFile, writeFile } from 'node:fs/promises';

const pkg = await readFile('./package.json', 'utf8').then((data) => JSON.parse(data));

const LATEST_TAG = await x('git', ['describe', '--tags', '--abbrev=0']).then(({ stdout }) =>
	stdout.trim()
);

console.log(`Checking for renovate commits since ${LATEST_TAG} tag...\n`);

const writeChangesets = Object.keys(pkg.dependencies).map(async (dependencyName) => {
	const { stdout: commit } = await x('git', [
		'log',
		'-1',
		'-G',
		`"${dependencyName}":`,
		'--format=commit %h%nauthor %an%n%n%B',
		`${LATEST_TAG}..HEAD`,
		'package.json',
	]);

	const match = /^commit (?<hash>[\da-f]+)\nauthor renovate\[bot]\n\n(?<body>[\S\s]+)$/gm.exec(
		commit
	);

	if (!match) {
		console.log(`No renovate commits for '${dependencyName}'`);
		return;
	}

	const data = `---\neleventy-plugin-vento: minor\n---\n\n${match.groups.body}`;

	await writeFile(`./.changeset/renovate-${dependencyName}-${match.groups.hash}.md`, data, 'utf8');

	return true;
});

await Promise.all(writeChangesets).then((writers) => {
	const { length: files } = writers.filter(Boolean);
	console.log(`\nGenerated ${files} changeset files.\n`);
});
