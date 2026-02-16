import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    files: ['server/**/*.ts'],
    rules: {
      'ts/consistent-type-imports': 'off',
    },
  }
)
