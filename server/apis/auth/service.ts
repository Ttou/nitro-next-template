import type { Queue } from 'bullmq'
import { EntityManager } from '@mikro-orm/core'
import { InjectQueue } from '@nestjs/bullmq'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SysOnlineEntity, SysUserEntity } from '~server/database'
import { CaptchaService, HashService, LogoutService } from '~server/extends'
import { QueueNameEnum } from '~server/queues'
import { ContextService } from '~server/shared'
import { YesOrNoEnum } from '~shared/enums'
import { generateId } from '~shared/utils'
import { LoginReqDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue(QueueNameEnum.ONLINE) private onlineQueue: Queue,
    private captchaService: CaptchaService,
    private jwtService: JwtService,
    private hashService: HashService,
    private logoutService: LogoutService,
    private contextService: ContextService,
    private em: EntityManager,
  ) {}

  async login(dto: LoginReqDto) {
    const { captchaId, captchaValue, userName, password } = dto

    const isCaseSensitive = await this.contextService.isCaptchaCaseSensitive()
    const isVerify = await this.captchaService.verify(captchaId, captchaValue, isCaseSensitive)

    if (!isVerify) {
      throw new BadRequestException('验证码错误')
    }

    const oldRecord = await this.em.findOne(SysUserEntity, {
      userName: { $eq: userName },
      isAvailable: { $eq: YesOrNoEnum.YES },
      isDelete: { $eq: YesOrNoEnum.NO },
    })

    if (!oldRecord) {
      throw new BadRequestException('用户不存在')
    }

    const isMatch = await this.hashService.compare(password, oldRecord.password)

    if (!isMatch) {
      throw new BadRequestException('账号或密码错误')
    }

    const { token, tokenId } = await this.createSign({ sub: oldRecord.id })

    const isSingleOnline = await this.contextService.isUserSingleOnline()

    if (isSingleOnline) {
      const oldOnlineRecord = await this.em.findOne(SysOnlineEntity, {
        user: {
          id: { $eq: oldRecord.id },
        },
      })

      if (oldOnlineRecord) {
        await this.em.remove(oldOnlineRecord).flush()
        await this.logoutService.add(oldOnlineRecord.token)
      }
    }

    // #region 执行添加在线记录
    const request = this.contextService.getRequest()
    const userAgent = request.headers['user-agent']!
    const ip = request.ip!
    await this.onlineQueue.add(
      '',
      {
        tokenId,
        token,
        user: oldRecord,
        userAgent,
        ip,
      },
    )
    // #endregion

    return token
  }

  async logout() {
    const token = this.contextService.getToken()
    await this.logoutService.add(token)
  }

  private async createSign(payload: any) {
    const jti = generateId()
    const claims = {
      ...payload,
      jti,
    }
    const token = await this.jwtService.signAsync(claims)

    return {
      token,
      tokenId: jti,
    }
  }
}
