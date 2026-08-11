import { styleText as st } from 'node:util';

// External modules
import { createDebug } from 'obug';

// Export all debugging functions as one object
export const debug = {
	main: createDebug('Eleventy:Vento'),
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

export function warn(...messages: string[]) {
	for (const message of messages) {
		console.error(st('gray', '[warning]'), st('yellow', message));
	}
}
