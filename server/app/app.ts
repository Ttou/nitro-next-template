import type { Request } from 'express'
import { randomUUID } from 'node:crypto'
import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { ApisModule } from './apis'

@Module({
  imports: [
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
})
export class AppModule {}
