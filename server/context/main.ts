import type { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app'

export let ctx: INestApplicationContext

export async function initCtx() {
  ctx = await NestFactory.createApplicationContext(AppModule, {
    abortOnError: false,
  })

  await ctx.init()
}

export async function closeCtx() {
  await ctx.close()
}
