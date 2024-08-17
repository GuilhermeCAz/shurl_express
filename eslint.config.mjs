import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.all,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  { ignores: ['eslint.config.mjs'] },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { prettier },
    rules: {
      curly: ['error', 'multi-or-nest'],
      'init-declarations': ['error', 'never', { ignoreForLoopInit: true }],
      // 'func-style': ['error', 'declaration'],
      'new-cap': 'off',
      'one-var': ['error', 'consecutive'],
      'sort-keys': 'off',
      'sort-vars': 'off',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      // TODO:remove later
      'no-console': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
