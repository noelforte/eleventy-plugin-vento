// Extra utility types used in this project

/**
 * Matches any given string so autocomplete in literal unions works as expected
 */
export type AnyString = string & Record<never, never>;

/**
 * Generic shorthand for something that might be a promise
 */
export type MaybePromise<T> = T | PromiseLike<T>;
