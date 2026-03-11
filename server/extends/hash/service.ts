import type { HashModuleOptions } from './interface'
import { Inject, Injectable } from '@nestjs/common'
import bcrypt from '@node-rs/bcrypt'
import { HASH_MODULE_OPTIONS } from './module-define'

@Injectable()
export class HashService {
  constructor(
    @Inject(HASH_MODULE_OPTIONS) private options: HashModuleOptions,
  ) {}

  /**
   * 加密
   */
  async hash(value: string) {
    return await bcrypt.hash(value, this.options?.cost, this.options?.salt)
  }

  /**
   * 比较
   */
  get compare() {
    return bcrypt.compare
  }

  /**
   * 验证
   */
  get verify() {
    return bcrypt.verify
  }
}
