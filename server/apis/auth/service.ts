import type { HttpContext } from '@xlt-token/core'
import type { ICtxClsStore } from '~server/interfaces'
import { EntityManager } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { StpLogic } from '@xlt-token/core'
import { CLS_REQ, ClsService } from 'nestjs-cls'
import { ErrorEnum } from '~server/constants'
import { CaptchaService, ContextService, HashService } from '~server/shared'
import { SysUserEntity } from '~shared/db/entities'
import { YesOrNoEnum } from '~shared/enums'
import { LoginReqDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private captchaService: CaptchaService,
    private hashService: HashService,
    private contextService: ContextService,
    private em: EntityManager,
    private clsService: ClsService<ICtxClsStore>,
    private stp: StpLogic,
  ) {}

  async login(dto: LoginReqDto) {
    const { captchaId, captchaValue, userName, password } = dto

    const isCaseSensitive = await this.contextService.isCaptchaCaseSensitive()
    const isVerify = await this.captchaService.verify(captchaId, captchaValue, isCaseSensitive)

    if (!isVerify) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.CAPTCHA_ERROR))
    }

    const oldRecord = await this.em.findOne(SysUserEntity, {
      userName: { $eq: userName },
      isAvailable: { $eq: YesOrNoEnum.YES },
      isDelete: { $eq: YesOrNoEnum.NO },
    })

    if (!oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.USER_NOT_FOUND_ERROR))
    }

    const isMatch = await this.hashService.bcryptVerify({
      password,
      hash: oldRecord.password,
    })

    if (!isMatch) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.ACCOUNT_OR_PASSWORD_ERROR))
    }

    const token = await this.stp.login(oldRecord.id)

    return token
  }

  async logout() {
    const request = this.clsService.get<HttpContext>(CLS_REQ)
    const token = await this.stp.getTokenValue(request)
    await this.stp.logout(token!)
  }
}
