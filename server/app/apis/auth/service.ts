import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CacheService } from '~server/app/services'
import { LoginReqDto } from './dto'

@Injectable()
export class AuthService {
  private readonly logoutKey = 'logout:'

  constructor(
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginReqDto) {
    // return this.authService.login()
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    }
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
