import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'no-var': 'error'
    }
  },
  {
    ignores: [
      'coverage/**',
      'node_modules/**',
      'scripts/**',
      'quality-gate-report.md'
    ]
  }
];
