import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './auth'
import { CaptchaModule } from './captcha'
import { CurrentUserModule } from './current-user'
import { MonitorOnlineModule } from './monitor'

@Module({
  imports: [
    AuthModule,
    CaptchaModule,
    CurrentUserModule,
    MonitorOnlineModule,
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
        ],
      },
    ]),
  ],
})
export class ApisModule {}
