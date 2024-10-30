// Set up debugger global
import type { UserConfig } from '#localtypes/11ty.js';
import createDebugger from 'debug';

const debugBaseNamespace = 'Eleventy:Vento';

export const DEBUG = {
	setup: createDebugger(`${debugBaseNamespace}:Setup`),
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
export function runCompatibilityCheck(config: UserConfig) {
	DEBUG.setup('Run compatibility check');
	for (const [method, version] of REQUIRED_API_METHODS) {
		if (!config?.[method]) {
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
