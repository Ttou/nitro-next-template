import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { LoginReqDTO } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly clsService: ClsService,
  ) {}

  async login(data: LoginReqDTO) {
    // return this.authService.login()
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      requestId: this.clsService.getId(),
    }
  }
}
