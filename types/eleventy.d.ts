/**
 * @file Minimum viable types for Eleventy used by this plugin's source code
 */

declare module '@11ty/eleventy' {
	type EleventyContext = { eleventy?: Record<string, unknown>; page?: Record<string, unknown> } & {
		[K: string]: Record<string, unknown>;
	};

	type EleventyData = EleventyContext & { [K: string]: Record<string, unknown> };

	type EleventyEventListener<T> = (data: T) => void | Promise<void>;

	type EleventyFunction<T> = (...args: T[]) => unknown;
	type EleventyFunctionSet = Record<string, EleventyFunction<unknown>>;

	interface UserConfig {
		// Metadata retrieval
		directories: { includes: string };
		getFilters(): EleventyFunctionSet;
		getShortcodes(): EleventyFunctionSet;
		getPairedShortcodes(): EleventyFunctionSet;

		// Event listeners
		on(event: string, listener: EleventyEventListener);

		// Extension registering
		addTemplateFormats(extension: string): void;
		addExtension(extension: string, extensionConfig: ExtensionConfig);

		[K: string]: unknown;
	}
}
