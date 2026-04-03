import type { HashModuleOptions } from './interface'
import { Inject, Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
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
    return await bcrypt.hash(value, this.options.salt)
  }

  /**
   * 比较
   */
  get compare() {
    return bcrypt.compare
  }

  /**
   * 生成盐
   */
  get genSalt() {
    return bcrypt.genSalt
  }
}
