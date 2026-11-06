import type { IRequest, IResponse } from '~server/interfaces'
import { EntityManager } from '@mikro-orm/mysql'
import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import { getDefaultXltInstance } from '@xlt-token/core'
import {
  buildInspectorRequest,
  createInspectorBridge,
  INSPECTOR_HTML,
} from '@xlt-token/inspector'
import { StpUtil, XltIgnore } from '@xlt-token/nestjs'
import { SysUserEntity } from '~db/entities'
import { xltEventBuffer } from '~server/customs'

@Controller()
@XltIgnore()
export class InspectorController {
  private readonly bridge = createInspectorBridge({
    instance: () => getDefaultXltInstance(),
    buffer: xltEventBuffer,
    auth: async (_req, context) => {
      const token = context.bearerToken
      if (!token)
        return false
      const loginId = await StpUtil.getLoginIdByToken(token)
      if (loginId == null)
        return false
      const user = await this.em.findOne(SysUserEntity, {
        id: {
          $eq: String(loginId),
        },
      }, {
        populate: ['roles'],
      })
      if (!user)
        return false
      return user.roles.getItems().some(role => role.roleKey === 'sys.role.admin')
    },
  })

  constructor(
    private readonly em: EntityManager,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  page(@Res() res: IResponse) {
    res.type('text/html; charset=utf-8')
    res.send(INSPECTOR_HTML)
  }

  @ApiExcludeEndpoint()
  @Get('api/overview')
  async overview(@Req() req: IRequest, @Res() res: IResponse) {
    const response = await this.bridge.handle(buildInspectorRequest('/overview', req))
    res.status(response.status).json(response.body)
  }

  @ApiExcludeEndpoint()
  @Get('api/events')
  async events(@Req() req: IRequest, @Res() res: IResponse) {
    const response = await this.bridge.handle(buildInspectorRequest('/events', req))
    res.status(response.status).json(response.body)
  }

  @ApiExcludeEndpoint()
  @Get('api/metrics')
  async metrics(@Req() req: IRequest, @Res() res: IResponse) {
    const response = await this.bridge.handle(buildInspectorRequest('/metrics', req))
    res.status(response.status).json(response.body)
  }

  @ApiExcludeEndpoint()
  @Get('api/sessions')
  async sessions(@Req() req: IRequest, @Res() res: IResponse) {
    const response = await this.bridge.handle(buildInspectorRequest('/sessions', req))
    res.status(response.status).json(response.body)
  }

  @ApiExcludeEndpoint()
  @Get('api/session-devices')
  async sessionDevices(@Req() req: IRequest, @Res() res: IResponse) {
    const response = await this.bridge.handle(buildInspectorRequest('/session-devices', req))
    res.status(response.status).json(response.body)
  }

  @ApiExcludeEndpoint()
  @Post('api/actions/kickout')
  async kickout(@Req() req: IRequest, @Res() res: IResponse) {
    const response = await this.bridge.handle(buildInspectorRequest('/actions/kickout', req))
    res.status(response.status).json(response.body)
  }

  @ApiExcludeEndpoint()
  @Post('api/actions/logout')
  async logout(@Req() req: IRequest, @Res() res: IResponse) {
    const response = await this.bridge.handle(buildInspectorRequest('/actions/logout', req))
    res.status(response.status).json(response.body)
  }
}
