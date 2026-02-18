import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './auth'
import { CaptchaModule } from './captcha'
import { CurrentUserModule } from './current-user'

@Module({
  imports: [
    AuthModule,
    CaptchaModule,
    CurrentUserModule,
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
        ],
      },
    ]),
  ],
})
export class ApisModule {}
