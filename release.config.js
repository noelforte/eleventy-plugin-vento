const presetConfig = {
	types: [
		{ type: 'feat', section: 'New Features' },
		{ type: 'fix', section: 'Bug Fixes' },
		{ type: 'refactor', section: 'Refactorings' },
		{ type: 'docs', hidden: 'Documentation' },
		{ type: 'chore', hidden: true },
		{ type: 'perf', hidden: true },
		{ type: 'style', hidden: true },
		{ type: 'test', hidden: true },
	],
};

/** @type {import('semantic-release').Options} */
export default {
	preset: 'conventionalcommits',
	presetConfig,
	plugins: [
		['@semantic-release/commit-analyzer'],
		'@semantic-release/release-notes-generator',
		'@semantic-release/npm',
		'@semantic-release/github',
	],
};
