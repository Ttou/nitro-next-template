import type { AlovaInstance } from '~nestjs-modules/alova'
import { isIPv4, isIPv6 } from 'node:net'
import { Injectable, Logger } from '@nestjs/common'
import { InjectAlova } from '~nestjs-modules/alova'
import { UrlEnum } from '~server/constants'

interface IIpLocationResponse {
  data: {
    COUNTRY_CN: string
    PROVINCE_CN: string
    CITY_CN: string
  }
}

@Injectable()
export class RemoteIpService {
  private readonly logger = new Logger(RemoteIpService.name)

  constructor(
    @InjectAlova() private alova: AlovaInstance,
  ) {}

  async toLocation(ip: string) {
    if (this.isInternalIP(ip)) {
      return '内网IP'
    }

    try {
      const { data } = await this.alova
        .Get<IIpLocationResponse>(UrlEnum.IP_PARSER, {
          params: { ip },
        })

      return [data.COUNTRY_CN, data.PROVINCE_CN, data.CITY_CN].join('/')
    }
    catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error))
      throw error
    }
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
