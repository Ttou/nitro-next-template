import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    files: ['server/**/*.ts'],
    rules: {
      'antfu/no-top-level-await': 'off',
      'ts/consistent-type-imports': 'off',
    },
  },
)
