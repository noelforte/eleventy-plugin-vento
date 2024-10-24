// Set up debugger global
import createDebugger from 'debug';
const debugBaseNamespace = 'Eleventy:Vento';
export const DEBUG = {
	setup: createDebugger(`${debugBaseNamespace}:Setup`),
	cache: createDebugger(`${debugBaseNamespace}:Cache`),
	template: createDebugger(`${debugBaseNamespace}:Template`),
};

// Project-wide constants
export const REQUIRED_API_METHODS = [
	['getShortcodes', 'v3.0.0-alpha.15'],
	['getPairedShortcodes', 'v3.0.0-alpha.15'],
	['getFilters', 'v3.0.0-alpha.15'],
	['addExtension', 'v1.0.0'],
];

export const CONTEXT_DATA_KEYS = ['page', 'eleventy'];

export const PERMALINK_PREFIX = 'EleventyVentoPermalink:';
