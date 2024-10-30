import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**'],
	format: 'esm',
	clean: true,
	dts: true,
	bundle: false,
});
