import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	project: ['src/**/*', 'tests/**/*.{js,ts}', '!tests/stubs*'],
	ignoreDependencies: ['@biomejs/biome'],
};

export default config;
