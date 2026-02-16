import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClsService } from 'nestjs-cls'
import { CacheService } from '~server/app/services'
import { LoginReqDto } from './dto'

@Injectable()
export class AuthService {
  private readonly logoutKey = 'logout:'

  constructor(
    private readonly cacheService: CacheService,
    private readonly clsService: ClsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginReqDto) {
    // return this.authService.login()
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      requestId: this.clsService.getId(),
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
