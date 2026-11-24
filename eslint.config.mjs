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
    // alova 生成的文件自带 `/* eslint-disable */`，不去约束其注释写法
    files: ['web/apis/**'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
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
