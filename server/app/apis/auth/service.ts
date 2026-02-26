import { EntityManager } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SysOnlineEntity, SysUserEntity } from '~server/app/entities'
import { CaptchaService, HashService, LogoutService } from '~server/app/services'
import { SharedService } from '~server/app/shared'
import { generateId } from '~shared/utils'
import { LoginReqDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly logoutService: LogoutService,
    private readonly sharedService: SharedService,
    private readonly em: EntityManager,
  ) {}

  async login(dto: LoginReqDto) {
    const { captchaId, captchaValue, userName, password } = dto

    const isCaseSensitive = await this.sharedService.isCaptchaCaseSensitive()
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

    const isSingleOnline = await this.sharedService.isUserSingleOnline()

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

    await this.addToOnline(token, tokenId, oldRecord)

    return token
  }

  async logout() {
    const token = this.sharedService.getToken()
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

  private async addToOnline(token: string, tokenId: string, user: SysUserEntity) {
    const request = this.sharedService.getRequest()
    const userAgent = request.headers['user-agent']!
    const ip = request.ip!

    const usResult = this.sharedService.parseUA(userAgent)
    const ipResult = await this.sharedService.parseIP(ip)

    const online = this.em.create(SysOnlineEntity, {
      tokenId,
      token,
      browser: [usResult.browser.name, usResult.browser.version].join(' '),
      os: [usResult.os.name, usResult.os.version].join(' '),
      ip: ipResult.ip,
      location: ipResult.location,
      loginTime: new Date(),
      user,
    })

    await this.em.persist(online).flush()
  }
}
