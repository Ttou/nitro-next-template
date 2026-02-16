import type { Request } from 'express'
import { randomUUID } from 'node:crypto'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClsModule } from 'nestjs-cls'
import { ApisModule } from './apis'
import { configuration } from './configs'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      skipProcessEnv: true,
      load: [configuration],
    }),
    ClsModule.forRootAsync({
      global: true,
      useFactory: () => ({
        middleware: {
          mount: true,
          generateId: true,
          idGenerator: (req: Request) =>
            req.headers['X-Request-Id'] ?? randomUUID(),
        },
      }),
    }),
    ApisModule,
  ],
  providers: [],
})
export class AppModule {}
