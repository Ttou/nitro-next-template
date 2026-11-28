import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    // alova 生成的文件自带 `/* eslint-disable */`，不去约束其注释写法
    files: ['web/apis/**'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },
  {
    // 前端禁止引用服务端模块：dev 下 nitro 插件会注入 ~db / ~server / ~nestjs-modules 别名，
    // 代码能解析甚至被打进浏览器包；但 build:web 只用 vite.config 的 ~web / ~shared，必然失败。
    files: ['web/**/*.{ts,tsx,vue}'],
    rules: {
      'ts/no-use-before-define': 'off',
      'ts/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '~db',
                '~db/*',
                '~server',
                '~server/*',
                '~nestjs-modules',
                '~nestjs-modules/*',
              ],
              message: '前端不能引用服务端模块（~db / ~server / ~nestjs-modules）：dev 能解析，但 build:web 没有这些别名，打包必失败。接口类型请用 ~web/apis，共享代码放 ~shared。',
            },
            {
              group: [
                '@mikro-orm/*',
                '@nestjs/*',
                'nestjs-*',
                'bullmq',
                'ioredis',
              ],
              message: '前端不能直接依赖服务端运行时库，请通过接口访问。',
            },
          ],
        },
      ],
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
