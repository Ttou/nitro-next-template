import { Injectable, Logger } from '@nestjs/common'
import { HttpClient, HttpResponseError } from '@nestjs/http-client'
import { UrlEnum } from '~server/constants'

interface ITransOptions {
  text: string
  source: string
  target: string
  targetKey: string
}

@Injectable()
export class RemoteTranslateService {
  private readonly logger = new Logger(RemoteTranslateService.name)

  constructor(
    private httpClient: HttpClient,
  ) {}

  async trans(options: ITransOptions) {
    const { data } = await this.httpClient
      .get(UrlEnum.TRANSLATE, { query: options })
      .catch((err) => {
        this.logger.error(err instanceof HttpResponseError
          ? err.body
          : err.message)
        throw err
      })

    return { [options.targetKey]: data.data.targetText }
  }
}
