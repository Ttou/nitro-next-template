import type { JwtModuleOptions } from './interface'
import { Inject, Injectable } from '@nestjs/common'
import jwt from '@node-rs/jsonwebtoken'
import { getUnixTimestamp, parseMs } from '~shared/utils'
import { JwtErrors } from './error'
import { JWT_MODULE_OPTIONS } from './module-define'

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_MODULE_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(payload: any) {
    return jwt.sign(this.createClaims(payload), this.options.secretKey, this.options.header)
  }

  signSync(payload: any) {
    return jwt.signSync(this.createClaims(payload), this.options.secretKey, this.options.header)
  }

  async verify(token: string) {
    try {
      return await jwt.verify(token, this.options.secretKey, this.options.validation)
    }
    catch (error) {
      throw JwtErrors[error.message]?.()
    }
  }

  verifySync(token: string) {
    try {
      return jwt.verifySync(token, this.options.secretKey, this.options.validation)
    }
    catch (error) {
      throw JwtErrors[error.message]?.()
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
