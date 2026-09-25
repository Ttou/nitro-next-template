import type { HashModuleOptions } from './interface'
import { getRandomValues } from 'node:crypto'
import { Inject, Injectable } from '@nestjs/common'
import { bcrypt, bcryptVerify } from 'hash-wasm'
import { defaultOptions } from './constant'
import { MODULE_OPTIONS_TOKEN } from './module-define'

@Injectable()
export class HashService {
  private options: HashModuleOptions

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private moduleOptions: HashModuleOptions,
  ) {
    this.options = Object.assign({}, defaultOptions, this.moduleOptions)
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
