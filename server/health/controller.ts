import { Controller, Get } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus'
import { UrlEnum } from '~server/constants'
import { Public } from '~server/decorators'

@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Public()
  @HealthCheck()
  @Get()
  check() {
    return this.health.check([
      () => this.http.responseCheck(UrlEnum.label(UrlEnum.IP_PARSER), UrlEnum.IP_PARSER, (res) => {
        return res.data?.data?.ISP_CODE === 'local'
      }, { params: { ip: '127.0.0.1' } }),
    ])
  }
}
