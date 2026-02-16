import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './auth'

@Module({
  imports: [
    AuthModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
        ],
      },
    ]),
  ],
})
export class ApisModule {}
