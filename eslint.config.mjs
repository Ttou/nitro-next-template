import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    files: ['web/**/*.vue'],
    rules: {
      'ts/no-use-before-define': 'off',
    },
  },
  {
    files: ['server/**/*.ts'],
    rules: {
      'antfu/no-top-level-await': 'off',
      'ts/consistent-type-imports': 'off',
      'ts/ban-ts-comment': 'off',
    },
  },
)
