import type { JwtModuleOptions } from './interface'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import jwt from '@node-rs/jsonwebtoken'
import { getUnixTimestamp, parseMs } from '~shared/utils'
import { JwtErrorEnum } from './constant'
import { JWT_MODULE_OPTIONS } from './module-define'

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_MODULE_OPTIONS) private options: JwtModuleOptions,
  ) {}

  async sign(payload: any) {
    return await jwt.sign(this.createClaims(payload), this.options.secretKey, this.options.header)
  }

  signSync(payload: any) {
    return jwt.signSync(this.createClaims(payload), this.options.secretKey, this.options.header)
  }

  async verify(token: string) {
    try {
      return await jwt.verify(token, this.options.secretKey, this.options.validation)
    }
    catch (error) {
      throw new UnauthorizedException(JwtErrorEnum.label(error.message))
    }
  }

  verifySync(token: string) {
    try {
      return jwt.verifySync(token, this.options.secretKey, this.options.validation)
    }
    catch (error) {
      throw new UnauthorizedException(JwtErrorEnum.label(error.message))
    }
  }

  private createClaims(payload: Record<string, any>) {
    const iat = getUnixTimestamp('seconds')
    const exp = iat + parseMs('seconds', this.options.expiresIn)

    return {
      ...payload,
      iat,
      exp,
    }
  }
}
