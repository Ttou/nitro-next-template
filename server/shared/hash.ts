import type { IHashConfig } from '~server/configs'
import { getRandomValues } from 'node:crypto'
import { Inject, Injectable } from '@nestjs/common'
import { bcrypt, bcryptVerify } from 'hash-wasm'
import { HashConfig } from '~server/configs'

@Injectable()
export class HashService {
  constructor(
    @Inject(HashConfig.KEY) private hashConfig: IHashConfig,
  ) {}

  /**
   * 加密
   */
  async bcryptCrypto(value: string) {
    return await bcrypt({
      password: value,
      ...this.hashConfig.bcrypt!,
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
