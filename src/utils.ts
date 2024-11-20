// Set up debugger global
import type { UserConfig } from '@11ty/eleventy';
import createDebugger from 'debug';

const debugBaseNamespace = 'Eleventy:Vento';

export const DEBUG = {
	main: createDebugger(debugBaseNamespace),
	cache: createDebugger(`${debugBaseNamespace}:Cache`),
	render: createDebugger(`${debugBaseNamespace}:Render`),
};

// Project-wide constants
export const REQUIRED_API_METHODS = [
	['getShortcodes', 'v3.0.0-alpha.15'],
	['getPairedShortcodes', 'v3.0.0-alpha.15'],
	['getFilters', 'v3.0.0-alpha.15'],
	['addExtension', 'v1.0.0'],
];

export const CONTEXT_DATA_KEYS = ['page', 'eleventy'];

// Helper functions
export function runCompatibilityCheck(config: UserConfig): void {
	DEBUG.main('Run compatibility check');
	for (const [method, version] of REQUIRED_API_METHODS) {
		if (!(method in config)) {
			console.error(
				'[eleventy-plugin-vento] Plugin compatibility error:',
				`\`${method}\``,
				'not found. Please use Eleventy',
				version,
				'or later.'
			);
		}
	}
}
