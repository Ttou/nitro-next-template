import type { Queue } from 'bullmq'
import type { SysOperateEntityDto, SysUserEntityDto } from '~server/openapi'
import type { ICtxClsStore, IRequest } from '../interfaces'
import { EntityManager } from '@mikro-orm/core'
import { InjectQueue } from '@nestjs/bullmq'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { omitBy, uniqBy } from 'es-toolkit'
import { CLS_REQ, ClsService } from 'nestjs-cls'
import { match } from 'ts-pattern'
import { ClsKeyEnum, ErrorEnum } from '~server/constants'
import { QueueNameEnum } from '~server/queues'
import { BaseEntity, SysConfigEntity, SysUserEntity } from '~shared/db/entities'
import { YesOrNoEnum } from '~shared/enums'

@Injectable()
export class ContextService {
  constructor(
    @InjectQueue(QueueNameEnum.OPERATE) private operateQueue: Queue,
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
   * 设置当前用户
   */
  async setCurrentUser(loginId: string) {
    const user = await this.em.findOne(SysUserEntity, {
      id: { $eq: loginId },
    }, {
      populate: ['roles.menus'],
      exclude: ['password'],
    })

    if (!user) {
      throw new UnauthorizedException(ErrorEnum.label(ErrorEnum.USER_NOT_FOUND_ERROR))
    }

    const { roles, posts, depts, ...rest } = user as unknown as SysUserEntityDto
    const roleList = [...roles]
    const permissions = uniqBy(roleList.map(role => [...role.menus]).flat(1), menu => menu.id).map(menu => menu.menuKey) || []
    const _roles = roleList.map(role => role.roleKey) || []
    const currentUser = { ...rest, permissions, roles: _roles }

    this.clsService.set(ClsKeyEnum.CURRENT_USER, currentUser)
  }

  /**
   * 获取当前用户
   */
  getCurrentUser() {
    return this.clsService.get(ClsKeyEnum.CURRENT_USER)
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
   * 获取用户初始密码
   */
  async getInitPassword() {
    const initPasswordConfig = await this.em.findOne(SysConfigEntity, {
      configKey: { $eq: 'sys.user.initPassword' },
    })

    return initPasswordConfig!.configValue
  }

  /**
   * 添加操作日志
   */
  async addOperate(data: SysOperateEntityDto) {
    // 移除用户关联表属性
    const user = omitBy(data.user, val => Array.isArray(val))
    await this.operateQueue.add('', { ...data, user })
  }

  bindCurrentUserToEntity<T extends BaseEntity>(entity: T, bindType: 'create' | 'update') {
    match(bindType).with('create', () => {
      entity.createBy = this.getCurrentUser().userName
    }).with('update', () => {
      entity.updateBy = this.getCurrentUser().userName
    }).exhaustive()
  }
}
