import type { JwtPayload, RedisClient } from '~server/interfaces'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ConfigSchema } from '~server/configs'
import { parseMs } from '~shared/utils'

@Injectable()
export class LogoutService {
  private readonly logoutKeyPrefix = 'logout'
  private readonly logoutKeySeparator = ':'

  constructor(
    @InjectRedis() private redisClient: RedisClient,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  /**
   * 添加到已登出
   */
  async add(token: string) {
    const result = await this.jwtService.verifyAsync<JwtPayload>(token)
    const ttl = (result.exp - result.iat) * 1000
    const parsedExpire = parseMs('seconds', `${ttl}`)

    this.redisClient.setex(this.getLogoutKey(result.jti), parsedExpire, '1')
  }

  /**
   * 校验是否已登出
   */
  async verify(token: string) {
    const result = await this.jwtService.verifyAsync<JwtPayload>(token)
    const isLogout = await this.redisClient.get(this.getLogoutKey(result.jti))

    return isLogout === '1'
  }

  private getLogoutKey(tokenId: string) {
    return [this.configService.get<ConfigSchema['appName']>('appName'), this.logoutKeyPrefix, tokenId].join(this.logoutKeySeparator)
  }
}
