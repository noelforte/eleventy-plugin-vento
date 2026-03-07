// This file reimplements a lot of the functionality from
// ventojs/core/errors.ts specifically for Eleventy.
//
// Eleventy provides additional context about files
// involved in errors and formats the error stack, so it's
// necessary to copy and modify Vento's `stringifyError`
// function for ideal formatting

import { VentoError, type ErrorContext } from 'ventojs/core/errors.js';
import { debug, warn } from './logging.js';

const LINE_TERMINATOR = /(\r\n?|[\n\u2028\u2029])/;

export class EleventyVentoError extends Error {
	context?: ErrorContext;

	constructor(message: string, context?: ErrorContext, cause?: Error) {
		super(message, { cause });
		this.context = context;
	}

	static async createFromContext(error: VentoError) {
		const ctx = await error.getContext();
		const err = new this('An unknown error occured processing Vento templates', ctx, error);

		if (!ctx.position || !ctx.file) {
			warn(
				`A \`${ctx.type}\` was thrown, but the exact position within the source code cannot be obtained`,
				'Use DEBUG="Eleventy:Vento*" to view raw `ErrorContext` information'
			);
		}
		debug.error('Received `ErrorContext` from Vento: %O', ctx);

		if (ctx.file === undefined) {
			return err;
		}

		err.message = `${ctx.type} in ${ctx.file}`;

		if (ctx.position === undefined || ctx.source === undefined) {
			return err;
		}

		// Get source line/column
		const sourceLines = codeToLines(ctx.source);
		const [sourceLine, sourceColumn] = locateInCode(sourceLines, ctx.position);
		err.message += `:${sourceLine}:${sourceColumn}:\n\n`;

		// Establish padding and indent
		const pad = sourceLine.toString().length;
		const indent = ' '.repeat(pad);

		// Print lines of code leading up to error
		for (let line = Math.max(sourceLine - 3, 1); line <= sourceLine; line++) {
			err.message += `${`${line}`.padStart(pad)} │ ${sourceLines[line - 1].trimEnd()}\n`;
		}

		// Annotate source
		err.message += `${indent}   ${' '.repeat(sourceColumn - 1)}^`;

		if (!ctx.code || ctx.line === undefined || ctx.column === undefined) {
			return err;
		}

		// If we have the compiled code, add that line too
		const codelines = codeToLines(ctx.code);
		err.message +=
			`\n\n` +
			`${indent} │ /// compiled Vento function for ${ctx.file} ///\n` +
			`${indent} │ ${codelines[ctx.line - 1].trimEnd()}\n` +
			`${indent}   ${' '.repeat(ctx.column - 1)}^`;

		return err;
	}
}

/**
 * Converts a code string to an array of lines
 */
function codeToLines(code: string) {
	const doubleLines = code.split(LINE_TERMINATOR);
	const lines = [];
	for (let i = 0; i < doubleLines.length; i += 2) {
		lines.push(`${doubleLines[i]}${doubleLines[i + 1] ?? ''}`);
	}
	return lines;
}

/**
 * Identifies the line/column location from a character index
 */
function locateInCode(lines: string[], position: number) {
	if (position < 0) {
		return [1, 1];
	}

	let index = 0;
	for (const [line, content] of lines.entries()) {
		const { length } = content;
		if (position < index + length) {
			return [line + 1, position - index + 1];
		}
		index += length;
	}

	throw new Error(`Positon ${position} is out of bounds for the provided source`);
}
