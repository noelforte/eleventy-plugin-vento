---
'eleventy-plugin-vento': minor
---

Error logging improvements (thanks @tmcw for the help on this!)

This addition leverages Vento's `stringifyError` utility to capture and pretty-print syntax errors, which should improve the overall debugging experience.

Notably, the one case where this doesn't work is if Vento cannot capture a position from the source code [due to limitations in Node/Bun](https://github.com/noelforte/eleventy-plugin-vento/issues/408#issuecomment-3748576474). In this case, we'll log a warning to the console...

```
[warning] An error occured, but the exact location within the source code cannot be obtained
[warning] Set DEBUG="Eleventy:Vento:Error" to print the raw `ErrorContext` object
```

...and log the entire context object to the `DEBUG` namespace `Eleventy:Vento:Error`:

```
Eleventy:Vento:Error ErrorContext (via Vento) {
Eleventy:Vento:Error   type: 'SyntaxError',
Eleventy:Vento:Error   message: "Unexpected token '{'",
Eleventy:Vento:Error   source: '<div class="image-grid">\n' +
Eleventy:Vento:Error     '  {{ for image of collections.{{gallery}} }}\n' +
Eleventy:Vento:Error     '    <img src="{{ image }} ">\n' +
Eleventy:Vento:Error     '  {{ /for }}\n' +
Eleventy:Vento:Error     '</div>\n',
Eleventy:Vento:Error   code: '\n' +
Eleventy:Vento:Error     '          var {image,collections,gallery} = it;\n' +
Eleventy:Vento:Error     '          {\n' +
Eleventy:Vento:Error     '__exports.content += "<div class=\\"image-grid\\">\\n  ";\n' +
Eleventy:Vento:Error     '__pos=27;\n' +
Eleventy:Vento:Error     'for (let image of __env.utils.toIterator(collections.{{gallery}})) {\n' +
Eleventy:Vento:Error     '__exports.content += "\\n    <img src=\\"";\n' +
Eleventy:Vento:Error     '__pos=84;\n' +
Eleventy:Vento:Error     '__exports.content += (image) ?? "";\n' +
Eleventy:Vento:Error     '__exports.content += " \\">\\n  ";\n' +
Eleventy:Vento:Error     '}\n' +
Eleventy:Vento:Error     '__exports.content += "\\n</div>\\n";\n' +
Eleventy:Vento:Error     '}\n' +
Eleventy:Vento:Error     '        ',
Eleventy:Vento:Error   file: '_includes/partials/imageGrid.vto'
Eleventy:Vento:Error } +0ms
```
