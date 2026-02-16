import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './auth'
import { CaptchaModule } from './captcha'

@Module({
  imports: [
    AuthModule,
    CaptchaModule,
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
        ],
      },
    ]),
  ],
})
export class ApisModule {}
