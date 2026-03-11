import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './auth'
import { CaptchaModule } from './captcha'
import { CurrentUserModule } from './current-user'
import { MonitorOnlineModule } from './monitor'
import { SystemConfigModule, SystemDeptModule, SystemDictDataModule, SystemDictTypeModule, SystemLangModule, SystemMenuModule, SystemPostAuthModule, SystemPostModule, SystemRoleAuthModule, SystemRoleMenuModule, SystemRoleModule, SystemUserModule } from './system'

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
    SystemMenuModule,
    SystemPostModule,
    SystemPostAuthModule,
    SystemRoleModule,
    SystemRoleAuthModule,
    SystemRoleMenuModule,
    SystemUserModule,
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
              {
                path: 'menu',
                module: SystemMenuModule,
              },
              {
                path: 'post',
                module: SystemPostModule,
                children: [
                  {
                    path: 'auth',
                    module: SystemPostAuthModule,
                  },
                ],
              },
              {
                path: 'role',
                module: SystemRoleModule,
                children: [
                  {
                    path: 'auth',
                    module: SystemRoleAuthModule,
                  },
                  {
                    path: 'menu',
                    module: SystemRoleMenuModule,
                  },
                ],
              },
              {
                path: 'user',
                module: SystemUserModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
})
export class ApisModule {}
