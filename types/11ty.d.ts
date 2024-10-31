// aggregate and export types from 11ty.ts with some modifications

declare module '@11ty/eleventy' {
	import type { EleventyConfig, EleventyScope } from '11ty.ts';

	type EleventyContext = Partial<EleventyScope> & Record<string, unknown>;
	type PageData = EleventyContext & Record<string, unknown>;
	type UserConfig = EleventyConfig & {
		on(event: string, handler: (event: never) => void | Promise<void>): void;
	};
	type EleventyFunction = (...args: unknown[]) => unknown;
	type EleventyFunctionMap = Record<string, EleventyFunction>;
}
