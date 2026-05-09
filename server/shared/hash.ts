import { getRandomValues } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { bcrypt, bcryptVerify } from 'hash-wasm'
import { ConfigSchema } from '~server/configs'

@Injectable()
export class HashService {
  constructor(
    private configService: ConfigService,
  ) {}

  get options() {
    return this.configService.get<ConfigSchema['hash']>('hash')
  }

  /**
   * 加密
   */
  async bcryptCrypto(value: string) {
    return await bcrypt({
      password: value,
      ...this.options.bcrypt!,
    })
  }

  /**
   * 比较
   */
  get bcryptVerify() {
    return bcryptVerify
  }

  /**
   * 生成盐
   */
  genSalt() {
    const str = new Uint8Array(16)
    return getRandomValues(str)
  }
}
