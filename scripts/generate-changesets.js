import { x } from 'tinyexec';
import { readFile, writeFile } from 'node:fs/promises';

const pkg = await readFile('./package.json', 'utf8').then((data) => JSON.parse(data));

const LATEST_TAG = await x('git', ['describe', '--tags', '--abbrev=0']).then(({ stdout }) =>
	stdout.trim()
);

console.log(`Checking for renovate commits since ${LATEST_TAG} tag...\n`);

const writeChangesets = Object.keys(pkg.dependencies).map(async (dependencyName) => {
	const { author, hash, body } = await x('git', [
		'log',
		'-1',
		'-G',
		`"${dependencyName}":`,
		'--format={"hash":"%h","author":"%an","body":"%B"}',
		`${LATEST_TAG}..HEAD`,
		'package.json',
	]).then(({ stdout }) => (stdout ? JSON.parse(stdout) : {}));

	if (author !== 'renovate[bot]') {
		console.log(`No renovate commits for '${dependencyName}'`);
		return;
	}

	const data = `---\neleventy-plugin-vento: minor\n---\n\n${body}`;

	await writeFile(`./.changeset/renovate-${dependencyName}-${hash}.md`, data, 'utf8');

	return true;
});

await Promise.all(writeChangesets).then((writers) => {
	const { length: files } = writers.filter(Boolean);
	console.log(`\nGenerated ${files} changeset files.\n`);
});
