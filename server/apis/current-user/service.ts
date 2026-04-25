import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ErrorEnum } from '~server/constants'
import { SysUserEntity } from '~server/database'
import { HashService } from '~server/extends'
import { ContextService } from '~server/shared'
import { UpdateCurrentUserPasswordReqDto, UpdateCurrentUserProfileReqDto } from './dto'

@Injectable()
export class CurrentUserService {
  constructor(
    private hashService: HashService,
    private contextService: ContextService,
    private em: EntityManager,
  ) {}

  async getInfo() {
    const currentUser = this.contextService.getCurrentUser()

    const userInfo = await this.em.findOne(SysUserEntity, {
      userName: { $eq: currentUser.userName },
    }, {
      populate: ['roles.menus'],
      exclude: ['password'],
    })

    return userInfo
  }

  async getProfile() {
    const currentUser = this.contextService.getCurrentUser()

    const userProfile = await this.em.findOne(SysUserEntity, {
      id: { $eq: currentUser.id },
    }, {
      exclude: ['password'],
    })

    return userProfile
  }

  async updateProfile(data: UpdateCurrentUserProfileReqDto) {
    const currentUser = this.contextService.getCurrentUser()

    const oldRecord = await this.em.findOne(SysUserEntity, {
      id: { $eq: currentUser.id },
    })

    if (!oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.USER_NOT_FOUND_ERROR))
    }

    wrap(oldRecord).assign({ ...data })
  }

  async updatePassword(data: UpdateCurrentUserPasswordReqDto) {
    const currentUser = this.contextService.getCurrentUser()
    const { oldPassword, newPassword } = data

    const isMatch = await this.hashService.bcryptVerify({
      password: oldPassword,
      hash: currentUser.password,
    })

    if (!isMatch) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.PASSWORD_NOT_MATCH_ERROR))
    }

    const oldRecord = await this.em.findOne(SysUserEntity, {
      $and: [
        { id: { $eq: currentUser.id } },
        { userName: { $eq: currentUser.userName } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.USER_NOT_FOUND_ERROR))
    }

    const password = await this.hashService.bcrypt(newPassword)

    wrap(oldRecord).assign({ password })

    await this.em.persist(oldRecord).flush()
  }
}
