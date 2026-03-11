import type { LogoutModuleOptions } from './interface'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { merge } from 'es-toolkit'
import { CacheService } from '~server/extends'
import { defaultOptions } from './constant'
import { LOGOUT_MODULE_OPTIONS } from './module-define'

@Injectable()
export class LogoutService {
  constructor(
    @Inject(LOGOUT_MODULE_OPTIONS) private logoutModuleOptions: LogoutModuleOptions,
    private cacheService: CacheService,
    private jwtService: JwtService,
  ) {}

  get options() {
    return merge(defaultOptions, this.logoutModuleOptions)
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
    return [this.options.logoutKey, tokenId].join(this.cacheService.options.keyPrefixSeparator)
  }
}
