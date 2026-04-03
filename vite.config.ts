import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    singleQuote: true,
    semi: false,
    trailingComma: 'all',
    ignorePatterns: ['**/*.mdx', '**/*.md', 'node_modules', 'public', 'dist', '.astro'],
    sortImports: {
      groups: [
        'type-import',
        ['value-builtin', 'value-external'],
        'type-internal',
        'value-internal',
        ['type-parent', 'type-sibling', 'type-index'],
        ['value-parent', 'value-sibling', 'value-index'],
        'unknown',
      ],
    },
  },
  lint: {
    ignorePatterns: ['**/*.mdx', '**/*.md', 'node_modules', 'public', 'dist', '.astro'],
    options: {
      typeAware: true,
    },
    categories: {
      correctness: 'warn',
    },
    rules: {
      'eslint/no-unused-vars': 'error',
    },
  },
  run: {
    cache: true,
  },
})
