import { randomUUID } from 'node:crypto'
import { EntityManager } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SysOnlineEntity, SysUserEntity } from '~server/app/entities'
import { CacheService, CaptchaService, HashService } from '~server/app/services'
import { SharedService } from '~server/app/shared'
import { LoginReqDto } from './dto'

@Injectable()
export class AuthService {
  private readonly logoutKey = 'logout:'

  constructor(
    private readonly cacheService: CacheService,
    private readonly captchaService: CaptchaService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly sharedService: SharedService,
    private readonly em: EntityManager,
  ) {}

  async login(data: LoginReqDto) {
    const { captchaId, captchaValue, userName, password } = data

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
        await this.addToLogout(oldOnlineRecord.token)
      }
    }

    await this.addToOnline(token, tokenId, oldRecord)

    return token
  }

  async logout() {
    const token = this.sharedService.getToken()
    await this.addToLogout(token)
  }

  private createSign(payload: any) {
    const jti = randomUUID()
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

  /**
   * 添加到已登出
   */
  async addToLogout(token: string) {
    const result = await this.jwtService.verify(token)
    const ttl = (result.exp - result.iat) * 1000

    this.cacheService.set(this.getCacheKey(result.jti), 1, `${ttl}`)
  }

  /**
   * 校验是否已登出
   */
  async verifyLogout(token: string) {
    const result = await this.jwtService.verify(token)
    const isLogout = await this.cacheService.get(this.getCacheKey(result.jti))

    return isLogout === 1
  }

  private getCacheKey(tokenId: string) {
    return this.logoutKey + tokenId
  }
}
