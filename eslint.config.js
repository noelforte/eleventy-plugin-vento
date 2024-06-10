import js from '@eslint/js';

// Configs
import gitignore from 'eslint-config-flat-gitignore';
import eslintConfigPrettier from 'eslint-config-prettier';

// Plugins
import globals from 'globals';

export default [
	// Set ignores from gitignore
	gitignore(),

	// Import configuration presets
	js.configs.recommended,
	eslintConfigPrettier,

	// Configure ignores
	{
		ignores: ['**/node_modules'],
	},

	// Configure defaults
	{
		languageOptions: {
			ecmaVersion: 'latest',
		},
		rules: {
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
				},
			],
			'no-else-return': [
				'error',
				{
					allowElseIf: false,
				},
			],
			'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
			'prefer-object-spread': 'error',
			'prefer-const': ['error', { destructuring: 'all' }],
			'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
			'prefer-destructuring': [
				'error',
				{
					VariableDeclarator: { array: false, object: true },
					AssignmentExpression: { array: false, object: false },
				},
			],
			'object-shorthand': ['error', 'always'],
			'arrow-body-style': ['error', 'as-needed'],
			eqeqeq: ['error', 'smart'],
		},
	},

	// Match all node-files
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
];
