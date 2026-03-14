import type { ConfigSchema } from '~server/configs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { CacheService } from '~server/extends'

@Injectable()
export class LogoutService {
  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
    private jwtService: JwtService,
  ) {}

  get logoutKeyPrefix() {
    return this.configService.get<ConfigSchema['logoutKeyPrefix']>('logoutKeyPrefix')
  }

  /**
   * 添加到已登出
   */
  async add(token: string) {
    const result = await this.jwtService.verify(token)
    const ttl = (result.exp - result.iat) * 1000

    this.cacheService.set(this.getCacheKey(result.jti), 1, `${ttl}`)
  }

  /**
   * 校验是否已登出
   */
  async verify(token: string) {
    const result = await this.jwtService.verify(token)
    const isLogout = await this.cacheService.get(this.getCacheKey(result.jti))

    return isLogout === 1
  }

  private getCacheKey(tokenId: string) {
    return [this.logoutKeyPrefix, tokenId].join(this.cacheService.options.keyPrefixSeparator)
  }
}
