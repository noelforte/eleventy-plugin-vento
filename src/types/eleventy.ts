// Utility types to fill in gaps in Eleventy
import type { EleventyScope } from '11ty.ts';
import type { Merge, Promisable } from 'type-fest';

type UnknownData = Record<string, unknown>;

type EleventyDataCascade = Merge<EleventyScope, UnknownData>;

type EleventyFunction = (this: EleventyScope, ...args: unknown[]) => Promisable<string | undefined>;

type EleventyFunctionMap = Record<string, EleventyFunction>;

export type { EleventyDataCascade, EleventyFunction, EleventyFunctionMap };
