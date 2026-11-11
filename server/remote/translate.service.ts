import type { AlovaInstance } from '~nestjs-modules/alova'
import { Injectable, Logger } from '@nestjs/common'
import { InjectAlova } from '~nestjs-modules/alova'
import { UrlEnum } from '~server/constants'

interface ITransOptions {
  text: string
  source: string
  target: string
  targetKey: string
}

interface ITransResponse {
  data: {
    targetText: string
  }
}

@Injectable()
export class RemoteTranslateService {
  private readonly logger = new Logger(RemoteTranslateService.name)

  constructor(
    @InjectAlova() private alova: AlovaInstance,
  ) {}

  async trans(options: ITransOptions) {
    try {
      const { data } = await this.alova
        .Get<ITransResponse>(UrlEnum.TRANSLATE, { params: options })

      return { [options.targetKey]: data.data.targetText }
    }
    catch (error) {
      this.logger.error(error instanceof Error ? error.message : String(error))
      throw error
    }
  }
}
