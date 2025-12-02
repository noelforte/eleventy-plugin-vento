import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/plugin.ts'],
	fixedExtension: true,
	platform: 'node'
});
