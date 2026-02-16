import { Body, Controller, Get, Post } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'Hello from NestJS' }
  }

  @Get('hello')
  getApiHello() {
    return { hello: 'world', timestamp: Date.now() }
  }

  @Post('data')
  postApiData(@Body() body: any) {
    return { received: body, success: true }
  }
}
