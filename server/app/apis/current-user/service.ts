import { EntityManager, wrap } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysUserEntity } from '~server/app/entities'
import { HashService } from '~server/app/services'
import { SharedService } from '~server/app/shared'
import { UpdateCurrentUserPasswordReqDto, UpdateCurrentUserProfileReqDto } from './dto'

@Injectable()
export class CurrentUserService {
  constructor(
    private readonly hashService: HashService,
    private readonly sharedService: SharedService,
    private readonly em: EntityManager,
  ) {}

  async getInfo() {
    const currentUser = this.sharedService.getCurrentUser()

    const userInfo = await this.em.findOne(SysUserEntity, {
      userName: { $eq: currentUser.userName },
    }, {
      populate: ['roles.menus'],
      exclude: ['password'],
    })

    return userInfo
  }

  async getProfile() {
    const currentUser = this.sharedService.getCurrentUser()

    const userProfile = await this.em.findOne(SysUserEntity, {
      id: { $eq: currentUser.id },
    }, {
      exclude: ['password'],
    })

    return userProfile
  }

  async updateProfile(data: UpdateCurrentUserProfileReqDto) {
    const currentUser = this.sharedService.getCurrentUser()

    const oldRecord = await this.em.findOne(SysUserEntity, {
      id: { $eq: currentUser.id },
    })

    if (!oldRecord) {
      throw new BadRequestException('用户不存在')
    }

    wrap(oldRecord).assign({ ...data })
  }

  async updatePassword(data: UpdateCurrentUserPasswordReqDto) {
    const currentUser = this.sharedService.getCurrentUser()
    const { oldPassword, newPassword } = data

    const isMatch = await this.hashService.compare(oldPassword, currentUser.password)

    if (!isMatch) {
      throw new BadRequestException('旧密码错误')
    }

    const oldRecord = await this.em.findOne(SysUserEntity, {
      $and: [
        { id: { $eq: currentUser.id } },
        { userName: { $eq: currentUser.userName } },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException('用户不存在')
    }

    const password = await this.hashService.hash(newPassword)

    wrap(oldRecord).assign({ password })

    await this.em.persist(oldRecord).flush()
  }
}
