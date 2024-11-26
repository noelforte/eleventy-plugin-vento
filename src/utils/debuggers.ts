import createDebugger from 'debug';

const debugBaseNamespace = 'Eleventy:Vento';

export const debugMain = createDebugger(debugBaseNamespace);
export const debugCache = createDebugger(`${debugBaseNamespace}:Cache`);
export const debugRender = createDebugger(`${debugBaseNamespace}:Render`);
