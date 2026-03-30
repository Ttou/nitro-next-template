import type { RedisClient } from '~server/extends'
import type { LogoutModuleOptions } from './interface'
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { merge } from 'es-toolkit'
import { JwtErrorEnum, JwtService, REDIS_CLIENT } from '~server/extends'
import { ContextService } from '~server/shared'
import { parseMs } from '~shared/utils'
import { defaultOptions } from './constant'
import { LOGOUT_MODULE_OPTIONS } from './module-define'

@Injectable()
export class LogoutService {
  constructor(
    @Inject(LOGOUT_MODULE_OPTIONS) private logoutModuleOptions: LogoutModuleOptions,
    @Inject(forwardRef(() => REDIS_CLIENT)) private redisClient: RedisClient,
    private jwtService: JwtService,
    private contextService: ContextService,
  ) {}

  get options() {
    return merge(defaultOptions, this.logoutModuleOptions)
  }

  /**
   * 添加到已登出
   */
  async add(token: string) {
    try {
      const result = await this.jwtService.verify(token)
      const ttl = (result.exp - result.iat) * 1000
      const parsedExpire = parseMs('seconds', `${ttl}`)

      this.redisClient.setex(this.getLogoutKey(result.jti), parsedExpire, '1')
    }
    catch (error) {
      await this.handleError(error, token)
    }
  }

  /**
   * 校验是否已登出
   */
  async verify(token: string) {
    try {
      const result = await this.jwtService.verify(token)
      const isLogout = await this.redisClient.get(this.getLogoutKey(result.jti))

      return isLogout === '1'
    }
    catch (error) {
      await this.handleError(error, token)
      return null
    }
  }

  private async handleError(error: any, token: string) {
    if (error.message === JwtErrorEnum.label(JwtErrorEnum.EXPIRED_SIGNATURE)) {
      await this.contextService.removeOnlineUser(token)
      throw new UnauthorizedException(error.message)
    }
  }

  private getLogoutKey(tokenId: string) {
    return [this.options.keyPrefix, tokenId].join(this.options.keyPrefixSeparator)
  }
}
