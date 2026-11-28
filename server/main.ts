import type { NestNodeApplication } from '@nestjs/platform-node'
import { NestFactory } from '@nestjs/core'
import { NodeAdapter } from '@nestjs/platform-node'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NativeLogger } from 'nestjs-pino'
import { createSchema } from 'zod-openapi'
import { AppModule } from './app.module'
import { sharedConfig } from './configs'
import { APP_ENV, AppEnvEnum } from './enums'
import { basicAuth } from './middlewares'

/**
 * 递归去掉 `additionalProperties`
 *
 * zod 的 output 方向会渲染出 `additionalProperties: false`（解析时剥离未知字段），
 * 但接口响应并非封闭结构，保留会与实际返回不符
 */
function stripAdditionalProperties<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => stripAdditionalProperties(item)) as T
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'additionalProperties')
      .map(([key, item]) => [
        key,
        stripAdditionalProperties(item),
      ]),
  ) as T
}

async function bootstrap() {
  const adpater = new NodeAdapter()
  const app = await NestFactory.create<NestNodeApplication>(
    AppModule,
    adpater,
    {
      abortOnError: false,
      bufferLogs: true,
    },
  )

  app.enableShutdownHooks()

  const instance = app.getHttpAdapter().getInstance()

  // #region 日志配置
  const logger = app.get(NativeLogger)
  app.useLogger(logger)
  app.flushLogs()
  // #endregion

  // #region Basic Auth 保护路径
  const { user, pass } = sharedConfig.basicAuth ?? {}
  if (user && pass) {
    const auth = basicAuth({
      users: { [user]: pass },
      challenge: true,
    })
    app.use('/health', auth)
    app.use('/bull-ui', auth)
  }
  // #endregion

  if (APP_ENV === AppEnvEnum.DEV) {
    // #region Swagger 接口文档配置
    const config = new DocumentBuilder()
      .setTitle('Nitro Template')
      .setDescription('Nitro 模板接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config, {
      standardSchemaConverter: (schema, { schemaType }) => {
        const converted = createSchema(schema as never, {
          io: schemaType,
          openapiVersion: '3.0.0',
        })

        if (schemaType === 'input') {
          return { schema: converted.schema, components: converted.components }
        }

        return {
          schema: stripAdditionalProperties(converted.schema),
          components: Object.fromEntries(
            Object.entries(converted.components ?? {})
              .map(([name, component]) => [
                name,
                stripAdditionalProperties(component),
              ]),
          ),
        }
      },
    })
    SwaggerModule.setup('openapi', app, document, { swaggerUiEnabled: false })
    // #endregion
  }

  await app.init()

  return instance
}

export default await bootstrap()
