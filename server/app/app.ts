import type { Request } from 'express'
import { randomUUID } from 'node:crypto'
import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { AppController } from './app.controller'

@Module({
  imports: [
    ClsModule.forRootAsync({
      useFactory: () => ({
        middleware: {
          mount: true,
          generateId: true,
          idGenerator: (req: Request) =>
            req.headers['X-Request-Id'] ?? randomUUID(),
        },
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
