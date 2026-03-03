import { isIP } from 'node:net'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { UAParser } from 'ua-parser-js'

@Injectable()
export class ParseService {
  constructor(
    private httpService: HttpService,
  ) {}

  /**
   * 解析用户代理字符串
   * @param userAgent 用户代理字符串
   */
  parseUserAgent(userAgent: string) {
    return UAParser(userAgent)
  }

  /**
   * 解析IP地址
   * @param ip IP地址
   */
  async parseIP(ip: string) {
    if (isIP(ip) === 0) {
      return {
        location: 'UNKNOWN',
        ip: 'UNKNOWN',
      }
    }

    // const result = await <any>('https://api.vore.top/api/IPdata', { method: 'GET', params: { ip } })

    return {
      location: '',
      ip,
    }
  }
}
