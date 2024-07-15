const presetConfig = {
	types: [
		{ type: 'feat', section: 'New Features' },
		{ type: 'fix', section: 'Bug Fixes' },
		{ type: 'refactor', section: 'Refactors' },
		{ type: 'upstream', section: 'Dependency Updates' },
		{ type: 'docs', hidden: true },
		{ type: 'chore', hidden: true },
		{ type: 'perf', hidden: true },
		{ type: 'style', hidden: true },
		{ type: 'test', hidden: true },
	],
};

const releaseRules = [
	{ breaking: true, release: 'major' },
	{ type: 'upstream', release: 'patch' },
];

/** @type {import('semantic-release').Options} */
export default {
	preset: 'conventionalcommits',
	presetConfig,
	releaseRules,
	plugins: [
		['@semantic-release/commit-analyzer'],
		'@semantic-release/release-notes-generator',
		'@semantic-release/npm',
		'@semantic-release/github',
	],
};
