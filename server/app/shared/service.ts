import type { Request } from 'express'
import type { ICtxClsStore } from '../utils'
import { isIP } from 'node:net'
import { EntityManager } from '@mikro-orm/core'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { CLS_REQ, ClsService } from 'nestjs-cls'
import { UAParser } from 'ua-parser-js'
import { YesOrNoEnum } from '~shared/enums'
import { SysConfigEntity, SysUserEntity } from '../entities'

@Injectable()
export class SharedService {
  constructor(
    @Inject(CLS_REQ) private readonly request: Request,
    private readonly clsService: ClsService<ICtxClsStore>,
    private readonly em: EntityManager,
  ) {}

  getRequest() {
    return this.request
  }

  getToken() {
    const { authorization } = this.request.headers

    if (!authorization) {
      throw new UnauthorizedException('authorization 不存在')
    }

    const token = authorization.match(/Bearer (.+)/)?.[1]

    if (!token) {
      throw new UnauthorizedException('authorization 格式错误')
    }

    return token
  }

  async setCurrentUser(payload: any) {
    const user = await this.em.findOne(SysUserEntity, {
      id: { $eq: payload.sub },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    this.clsService.set('user', user)
  }

  getCurrentUser() {
    return this.clsService.get('user')
  }

  /**
   * 验证码大小写敏感
   */
  async isCaptchaCaseSensitive() {
    const captchaCaseSensitiveConfig = await this.em.findOne(SysConfigEntity, {
      configKey: { $eq: 'sys.captcha.caseSensitive' },
    })

    return captchaCaseSensitiveConfig!.configValue === YesOrNoEnum.YES
  }

  /**
   * 用户单机登录
   */
  async isUserSingleOnline() {
    const userSingleOnlineConfig = await this.em.findOne(SysConfigEntity, {
      configKey: { $eq: 'sys.user.singleOnline' },
    })

    return userSingleOnlineConfig!.configValue === YesOrNoEnum.YES
  }

  parseUA(ua: string) {
    return UAParser(ua)
  }

  async parseIP(ip: string) {
    if (isIP(ip) === 0) {
      return {
        location: 'UNKNOWN',
        ip: 'UNKNOWN',
      }
    }

    // const result = await <any>('https://api.vore.top/api/IPdata', { method: 'GET', params: { ip } })

    return {
      location: '',
      ip,
    }
  }
}
