import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	project: ['src/**/*', 'tests/**/*.{js,ts}', '!tests/stubs*'],
};

export default config;
