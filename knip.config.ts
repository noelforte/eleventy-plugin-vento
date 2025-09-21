import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	project: ['**/*.{js,ts}', '!tests/stubs*/**'],
};

export default config;
