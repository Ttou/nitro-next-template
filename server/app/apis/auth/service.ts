import type { Queue } from 'bullmq'
import { EntityManager } from '@mikro-orm/core'
import { InjectQueue } from '@nestjs/bullmq'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SysOnlineEntity, SysUserEntity } from '~server/app/entities'
import { CaptchaService, HashService, LogoutService } from '~server/app/extends'
import { QueueNameEnum } from '~server/app/queues'
import { ContextService } from '~server/app/shared'
import { generateId } from '~shared/utils'
import { LoginReqDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue(QueueNameEnum.ONLINE_USER) private onlineUserQueue: Queue,
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
    })

    if (!oldRecord) {
      throw new BadRequestException('用户不存在')
    }

    const isMatch = await this.hashService.compare(password, oldRecord.password)

    if (!isMatch) {
      throw new BadRequestException('账号或密码错误')
    }

    const { token, tokenId } = this.createSign({ sub: oldRecord.id.toString() })

    const isSingleOnline = await this.contextService.isUserSingleOnline()

    if (isSingleOnline) {
      const oldOnlineRecord = await this.em.findOne(SysOnlineEntity, {
        user: {
          id: { $eq: oldRecord.id },
        },
      })

      if (oldOnlineRecord) {
        await this.em.remove(oldOnlineRecord).flush()
        await this.logoutService.addToLogout(oldOnlineRecord.token)
      }
    }

    // #region 执行添加在线记录
    const request = this.contextService.getRequest()
    const userAgent = request.headers['user-agent']!
    const ip = request.ip!
    await this.onlineUserQueue.add(
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
    await this.logoutService.addToLogout(token)
  }

  private createSign(payload: any) {
    const jti = generateId()
    const claims = {
      ...payload,
      jti,
    }
    const token = this.jwtService.sign(claims)

    return {
      token,
      tokenId: jti,
    }
  }
}
