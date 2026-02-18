import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './auth'
import { CaptchaModule } from './captcha'
import { CurrentUserModule } from './current-user'
import { MonitorOnlineModule } from './monitor'
import { SystemConfigModule, SystemDeptModule, SystemDictDataModule, SystemDictTypeModule, SystemLangModule } from './system'

@Module({
  imports: [
    AuthModule,
    CaptchaModule,
    CurrentUserModule,
    MonitorOnlineModule,
    SystemConfigModule,
    SystemDeptModule,
    SystemDictTypeModule,
    SystemDictDataModule,
    SystemLangModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'captcha',
            module: CaptchaModule,
          },
          {
            path: 'current-user',
            module: CurrentUserModule,
          },
          {
            path: 'monitor',
            children: [
              {
                path: 'online',
                module: MonitorOnlineModule,
              },
            ],
          },
          {
            path: 'system',
            children: [
              {
                path: 'config',
                module: SystemConfigModule,
              },
              {
                path: 'dept',
                module: SystemDeptModule,
              },
              {
                path: 'dict',
                children: [
                  {
                    path: 'type',
                    module: SystemDictTypeModule,
                  },
                  {
                    path: 'data',
                    module: SystemDictDataModule,
                  },
                ],
              },
              {
                path: 'lang',
                module: SystemLangModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
})
export class ApisModule {}
