import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	project: ['**/*.{js,ts}', '!tests/stubs*/**'],
	ignoreDependencies: ['prettier', 'oxlint', 'sampo'],
};

export default config;
