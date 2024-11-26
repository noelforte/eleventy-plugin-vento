import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/plugin.ts'],
	format: 'esm',
	dts: true, // Generate declaration file (.d.ts)
	splitting: false,
	clean: true,
});
