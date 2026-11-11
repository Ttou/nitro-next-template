import type { IConfig } from '~server/configs'
import type { AuthPublicKeyResDto } from './auth.dto'
import { Buffer } from 'node:buffer'
import { constants, createPublicKey, privateDecrypt } from 'node:crypto'
import { EntityManager } from '@mikro-orm/mysql'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StpLogic } from '@xlt-token/core'
import { SysUserEntity } from '~db/entities'
import { CaptchaService } from '~nestjs-modules/captcha'
import { HashService } from '~nestjs-modules/hash'
import { ErrorEnum } from '~server/constants'
import { ContextService } from '~server/context'
import { YesOrNoEnum } from '~shared/enums'
import { LoginReqDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private captchaService: CaptchaService,
    private configService: ConfigService,
    private hashService: HashService,
    private contextService: ContextService,
    private em: EntityManager,
    private stp: StpLogic,
  ) {}

  async login(dto: LoginReqDto) {
    const { captchaId, captchaValue, userName } = dto

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
      password: this.decryptPassword(dto.password),
      hash: oldRecord.password,
    })

    if (!isMatch) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.ACCOUNT_OR_PASSWORD_ERROR))
    }

    const token = await this.stp.login(oldRecord.id)

    return token
  }

  /**
   * 获取登录密码加密公钥
   */
  getPublicKey(): AuthPublicKeyResDto {
    const { publicKey } = this.configService.getOrThrow<IConfig['auth']>('auth')
    const der = createPublicKey(publicKey).export({ type: 'spki', format: 'der' })

    return {
      algorithm: 'RSA-OAEP-256',
      publicKey: der.toString('base64'),
    }
  }

  /**
   * 解密登录密码，失败时统一按账号或密码错误处理
   */
  private decryptPassword(password: string) {
    const { privateKey } = this.configService.getOrThrow<IConfig['auth']>('auth')

    try {
      return privateDecrypt(
        {
          key: privateKey,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(password, 'base64'),
      ).toString('utf8')
    }
    catch {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.ACCOUNT_OR_PASSWORD_ERROR))
    }
  }

  async logout() {
    const ctx = this.contextService.createHttpContext()
    const token = await this.stp.getTokenValue(ctx)
    await this.stp.logout(token!)
  }
}
