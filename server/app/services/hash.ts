import type { ConfigSchema } from '../configs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from '@node-rs/bcrypt'

@Injectable()
export class HashService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  /**
   * 加密
   */
  async hash(value: string) {
    return await bcrypt.hash(value, this.hashOptions?.cost, this.hashOptions?.salt)
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

  private get hashOptions() {
    return this.configService.get<ConfigSchema['hash']>('hash')
  }
}
