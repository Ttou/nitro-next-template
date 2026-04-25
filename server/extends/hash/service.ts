import type { HashModuleOptions } from './interface'
import { getRandomValues } from 'node:crypto'
import { Inject, Injectable } from '@nestjs/common'
import { bcrypt, bcryptVerify } from 'hash-wasm'
import { HASH_MODULE_OPTIONS } from './module-define'

@Injectable()
export class HashService {
  constructor(
    @Inject(HASH_MODULE_OPTIONS) private options: HashModuleOptions,
  ) {}

  /**
   * 加密
   */
  async bcrypt(value: string) {
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
