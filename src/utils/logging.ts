// Built-in modules
import { styleText as st } from 'node:util';

// External modules
import createDebugger from 'debug';

// Export all debugging functions as one object
export const debug = {
	main: createDebugger('Eleventy:Vento'),
	get cache() {
		return this.main.extend('Cache');
	},
	get render() {
		return this.main.extend('Render');
	},
	get error() {
		return this.main.extend('Error');
	},
};

/**
 * Log one or more warnings to stderr
 */
export function logWarning(...messages: string[]) {
	for (const message of messages) {
		console.error(st('gray', '[warning]'), st('yellow', message));
	}
}
