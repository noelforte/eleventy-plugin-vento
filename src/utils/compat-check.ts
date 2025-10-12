// Compatibility checks for this plugin to ensure API methods
// are available in Eleventy before proceeding

import type UserConfig from '@11ty/eleventy/UserConfig';
import { debugMain } from './debuggers.js';

const REQUIRED_API_METHODS = [
	['getShortcodes', 'v3.0.0-alpha.15'],
	['getPairedShortcodes', 'v3.0.0-alpha.15'],
	['getFilters', 'v3.0.0-alpha.15'],
	['addExtension', 'v1.0.0'],
];

export function compatibilityCheck(config: UserConfig): void {
	debugMain('Run compatibility check');
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
