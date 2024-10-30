import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// Configs
import eslintConfigPrettier from 'eslint-config-prettier';

// Plugins
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
	// Import configuration presets
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintPluginUnicorn.configs['flat/recommended'],
	eslintConfigPrettier,

	// Configure ignores
	{
		ignores: ['**/node_modules/**', 'dist'],
	},

	// Configure defaults
	{
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.node,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
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
			'unicorn/prevent-abbreviations': 'off',
		},
	}
);
