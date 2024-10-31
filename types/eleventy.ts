/**
 * @file Minimum viable types for Eleventy used by this plugin's source code
 */

export type EleventyContext = {
	eleventy?: Record<string, unknown>;
	page?: Record<string, unknown>;
} & {
	[K: string]: Record<string, unknown>;
};

export type EleventyData = EleventyContext & { [K: string]: Record<string, unknown> };

export type EleventyEventListener<T> = (data: T) => void | Promise<void>;

export type EleventyFunction<T> = (...args: T[]) => unknown;
export type EleventyFunctionSet = Record<string, EleventyFunction<unknown>>;

export interface UserConfig {
	// Metadata retrieval
	directories: { includes: string };
	getFilters(): EleventyFunctionSet;
	getShortcodes(): EleventyFunctionSet;
	getPairedShortcodes(): EleventyFunctionSet;

	// Event listeners
	on(event: string, listener: (evt: never) => void | Promise<void>): void;

	// Extension registering
	addTemplateFormats(extension: string): void;
	addExtension(extension: string, extensionConfig: object): void;

	[K: string]: unknown;
}
