import type { AxiosError } from 'axios'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { catchError, firstValueFrom } from 'rxjs'
import { UrlEnum } from '~server/constants'

interface ITransOptions {
  text: string
  source: string
  target: string
  targetKey: string
}

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name)

  constructor(
    private httpService: HttpService,
  ) {}

  async trans(options: ITransOptions) {
    const { data } = await firstValueFrom(
      this.httpService.get(UrlEnum.TRANSLATE, { params: options }).pipe(
        catchError((err: AxiosError) => {
          this.logger.error(err.response?.data)
          throw err
        }),
      ),
    )

    return { [options.targetKey]: data.data.targetText }
  }
}
