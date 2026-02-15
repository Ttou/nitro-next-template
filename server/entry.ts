import { app } from './app/main'

export default {
  async fetch(request: Request) {
    try {
      const fastifyApp: any = app.getHttpAdapter().getInstance()

      const headers: Record<string, string> = {}
      request.headers.forEach((value, key) => {
        headers[key] = value
      })

      const response: any = await fastifyApp.inject({
        method: request.method,
        url: request.url,
        headers,
        payload: request.body ? await request.text() : undefined,
      })

      const responseHeaders = new Headers()
      Object.entries(response.headers as Record<string, any>).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v: string) => responseHeaders.append(key, v))
        }
        else if (value) {
          responseHeaders.set(key, value)
        }
      })

      return new Response(response.payload, {
        status: response.statusCode,
        headers: responseHeaders,
      })
    }
    catch (error) {
      console.error('NestJS + Fastify error:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
}
