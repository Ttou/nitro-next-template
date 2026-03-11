import { isIP } from 'node:net'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { AxiosError } from 'axios'
import { catchError, firstValueFrom } from 'rxjs'
import { UAParser } from 'ua-parser-js'

@Injectable()
export class ParseService {
  private logger = new Logger(ParseService.name)

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
    if (this.isLocalIP(ip)) {
      return {
        location: 'UNKNOWN',
        ip: 'UNKNOWN',
      }
    }

    const { data } = await firstValueFrom(
      this.httpService.get('https://zj.v.api.aa1.cn/api/ip-taobao', { params: { ip } }).pipe(
        catchError((err: AxiosError) => {
          this.logger.error(err.response.data)
          throw err
        }),
      ),
    )

    return {
      location: [data.data.COUNTRY_CN, data.data.PROVINCE_CN, data.data.CITY_CN].join('/'),
      ip,
    }
  }

  /**
   * 检查是否为本地IP地址
   * @param ip IP地址
   */
  private isLocalIP(ip: string): boolean {
    const ipVersion = isIP(ip)

    if (ipVersion === 0) {
      return false
    }

    if (ipVersion === 4) {
      const parts = ip.split('.').map(Number)

      if (parts.length < 2) {
        return false
      }

      const first = parts[0]
      const second = parts[1]!

      return (
        ip === '127.0.0.1'
        || ip.startsWith('127.')
        || first === 10
        || (first === 172 && second >= 16 && second <= 31)
        || (first === 192 && second === 168)
      )
    }

    if (ipVersion === 6) {
      return ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd')
    }

    return false
  }
}
