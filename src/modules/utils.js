// Declare required APIs
const REQUIRED_API_METHODS = [
	['getShortcodes', 'v3.0.0-alpha.15'],
	['getPairedShortcodes', 'v3.0.0-alpha.15'],
	['getFilters', 'v3.0.0-alpha.15'],
	['addExtension', 'v1.0.0'],
];

export function error(message) {
	console.error(`[eleventy-plugin-vento] ${message}`);
}

/** @param {import("@11ty/eleventy").UserConfig} configApi */
export function runCompatibilityCheck(configApi) {
	for (const [method, version] of REQUIRED_API_METHODS) {
		if (!configApi?.[method]) {
			error(
				`Eleventy plugin compatibility error: '${method}' not available. Use Eleventy ${version} or later.`
			);
		}
	}
}
