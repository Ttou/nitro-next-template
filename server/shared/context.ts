import type { ICtxClsStore, IRequest } from '../interfaces'
import { EntityManager } from '@mikro-orm/core'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { CLS_REQ, ClsService } from 'nestjs-cls'
import { match } from 'ts-pattern'
import { ErrorEnum } from '~server/constants'
import { BaseEntity, SysConfigEntity, SysUserEntity } from '~server/database'
import { YesOrNoEnum } from '~shared/enums'

@Injectable()
export class ContextService {
  constructor(
    @Inject(CLS_REQ) private request: IRequest,
    private clsService: ClsService<ICtxClsStore>,
    private em: EntityManager,
  ) {}

  /**
   * 获取当前请求对象
   */
  getRequest() {
    return this.request
  }

  /**
   * 获取当前请求的 JWT 令牌
   */
  getToken() {
    const { authorization } = this.request.headers

    if (!authorization) {
      throw new UnauthorizedException(ErrorEnum.label(ErrorEnum.AUTHORIZATION_NOT_EXIST_ERROR))
    }

    const token = authorization.match(/Bearer (.+)/)?.[1]

    if (!token) {
      throw new UnauthorizedException(ErrorEnum.label(ErrorEnum.AUTHORIZATION_FORMAT_ERROR))
    }

    return token
  }

  /**
   * 设置当前用户
   * @param payload JWT 负载
   */
  async setCurrentUser(payload: any) {
    const user = await this.em.findOne(SysUserEntity, {
      id: { $eq: payload.sub },
    })

    if (!user) {
      throw new UnauthorizedException(ErrorEnum.label(ErrorEnum.USER_NOT_FOUND_ERROR))
    }

    this.clsService.set('user', user)
  }

  /**
   * 获取当前用户
   */
  getCurrentUser() {
    return this.clsService.get('user')
  }

  /**
   * 判断当前用户是否有指定权限
   * @param permission
   */
  async isCurrentUserHasPermission(permission: string) {
    const currentUser = this.getCurrentUser()

    const user = await this.em.findOne(SysUserEntity, {
      $and: [
        { id: { $eq: currentUser.id } },
        { roles: { menus: { menuKey: { $eq: permission } } } },
      ],
    })

    return !!user
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

  /**
   * 获取用户初始密码
   */
  async getInitPassword() {
    const initPasswordConfig = await this.em.findOne(SysConfigEntity, {
      configKey: { $eq: 'sys.user.initPassword' },
    })

    return initPasswordConfig!.configValue
  }

  bindCurrentUserToEntity<T extends BaseEntity>(entity: T, bindType: 'create' | 'update') {
    match(bindType).with('create', () => {
      entity.createBy = this.getCurrentUser().userName
    }).with('update', () => {
      entity.updateBy = this.getCurrentUser().userName
    }).exhaustive()
  }
}
