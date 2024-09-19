import { x } from 'tinyexec';
import { readFile, writeFile, appendFile } from 'node:fs/promises';

// Load data from package.json
const pkg = await readFile('./package.json', 'utf8').then((data) => JSON.parse(data));

// Declare latest tag
const LATEST_TAG = await x('git', ['describe', '--tags', '--abbrev=0']).then(({ stdout }) =>
	stdout.trim()
);

console.log(`Checking for renovate commits since ${LATEST_TAG} tag...\n`);

// Loop over each dependency, grab latest commit and match if it was comitted by
const writeChangesets = Object.keys(pkg.dependencies).map(async (dependencyName) => {
	const commit = await x('git', [
		'log',
		'-1',
		'--author',
		String.raw`renovate\[bot\]`,
		'-G',
		`"${dependencyName}":`,
		'--format=commit %h%n%B',
		`${LATEST_TAG}..HEAD`,
		'package.json',
	]);

	const match = /^commit (?<hash>[\da-f]+)$\n(?<body>[\S\s]+)$/gm.exec(commit.stdout);

	if (!match) {
		console.log(`No renovate commits for '${dependencyName}'`);
		await setOutput('changesets-created', false);
		return;
	}

	console.log(`Found update for ${dependencyName} at ${match.groups.hash}`);

	await writeFile(
		`./.changeset/z_dependencies_${dependencyName}.md`,
		`---\neleventy-plugin-vento: minor\n---\n\n${match.groups.body}`,
		'utf8'
	);

	await setOutput('changesets-created', true);

	return true;
});

await Promise.all(writeChangesets).then((writers) => {
	const { length: files } = writers.filter(Boolean);
	console.log(`\nGenerated ${files} changeset files.\n`);
});

async function setOutput(key, value) {
	if (process.env.GITHUB_OUTPUT) {
		await appendFile(process.env.GITHUB_OUTPUT, `${key}=${value}`);
	} else {
		process.stdout.write(`OUTPUT: ${key}=${value}\n`);
	}
}
