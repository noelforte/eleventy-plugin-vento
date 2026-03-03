// Debuggers used by eleventy-plugin-vento

import debug from 'debug';

export const debugMain = debug('Eleventy:Vento');
export const debugCache = debugMain.extend('Cache');
export const debugRender = debugMain.extend('Render');
export const debugError = debugMain.extend('Error');
