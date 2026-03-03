import { styleText as st } from 'node:util';

/**
 * Log one or more warnings to stderr
 */
export function logWarning(...messages: string[]) {
	for (const message of messages) {
		console.error(`${st('gray', '[warning]')} ${st('yellow', message)}`);
	}
}
