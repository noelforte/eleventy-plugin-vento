import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	project: ['**/*.{js,ts}', '!tests/stubs*/**'],
	ignoreDependencies: ['prettier'],
};

export default config;
