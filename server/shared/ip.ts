import type { AxiosError } from 'axios'
import { isIPv4, isIPv6 } from 'node:net'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { catchError, firstValueFrom } from 'rxjs'
import { LoggerService } from '~server/extends'

@Injectable()
export class IpService {
  constructor(
    private httpService: HttpService,
    private loggerService: LoggerService,
  ) {
    this.loggerService.setContext(IpService.name)
  }

  async toLocation(ip: string) {
    if (this.isInternalIP(ip)) {
      return '内网IP'
    }

    const { data } = await firstValueFrom(
      this.httpService.get('https://zj.v.api.aa1.cn/api/ip-taobao', { params: { ip } }).pipe(
        catchError((err: AxiosError) => {
          this.loggerService.error(err.response.data)
          throw err
        }),
      ),
    )

    return [data.data.COUNTRY_CN, data.data.PROVINCE_CN, data.data.CITY_CN].join('/')
  }

  isInternalIP(ip: string) {
    // 处理IPv6映射的IPv4地址
    if (ip.includes('::ffff:')) {
      ip = ip.split('::ffff:')[1]
    }

    // 判断IPv4
    if (isIPv4(ip)) {
      const parts = ip.split('.').map(Number)

      // A类：10.0.0.0 - 10.255.255.255
      if (parts[0] === 10)
        return true

      // B类：172.16.0.0 - 172.31.255.255
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
        return true

      // C类：192.168.0.0 - 192.168.255.255
      if (parts[0] === 192 && parts[1] === 168)
        return true

      // 本地回环：127.0.0.0 - 127.255.255.255
      if (parts[0] === 127)
        return true

      // 链路本地：169.254.0.0 - 169.254.255.255
      if (parts[0] === 169 && parts[1] === 254)
        return true

      return false
    }

    // 判断IPv6
    if (isIPv6(ip)) {
      // 常见的IPv6内网地址
      return (
        ip.startsWith('fc00:') // Unique Local Address (ULA)
        || ip.startsWith('fd00:') // Unique Local Address (ULA)
        || ip.startsWith('fe80:') // Link-Local Address
        || ip === '::1' // Localhost
      )
    }

    return false
  }
}
