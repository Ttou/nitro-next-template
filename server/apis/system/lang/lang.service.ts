import type { ILangEnum } from '~shared/enums'
import { raw, wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/mysql'
import { BadRequestException, Injectable } from '@nestjs/common'
import { SysLangEntity } from '~db/entities'
import { ErrorEnum } from '~server/constants'
import { ContextService } from '~server/context'
import { RemoveReqDto } from '~server/dtos'
import { RemoteTranslateService } from '~server/remote'
import { LangEnum, YesOrNoEnum } from '~shared/enums'
import {
  CreateSystemLangReqDto,
  FindSystemLangAllReqDto,
  FindSystemLangOneReqDto,
  FindSystemLangPageReqDto,
  ImportSystemLangSerDto,
  TranslateSystemLangReqDto,
  UpdateSystemLangReqDto,
} from './lang.dto'

@Injectable()
export class SystemLangService {
  constructor(
    private em: EntityManager,
    private contextService: ContextService,
    private remoteTranslateService: RemoteTranslateService,
  ) {}

  async create(dto: CreateSystemLangReqDto) {
    const oldRecord = await this.em.findOne(SysLangEntity, {
      langKey: { $eq: dto.langKey },
    })

    if (oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.LANG_EXIST_ERROR))
    }

    const lang = this.em.create(SysLangEntity, {
      ...dto,
      isBuiltin: dto.isBuiltin ?? YesOrNoEnum.NO,
      isAvailable: dto.isAvailable ?? YesOrNoEnum.YES,
    })
    this.contextService.bindCurrentUserToEntity(lang, 'create')

    await this.em.persist(lang).flush()
  }

  async findAll(dto: FindSystemLangAllReqDto) {
    const { langCode } = dto
    const qb = this.em.createQueryBuilder(SysLangEntity)

    const result = await qb
      .select(['langKey'])
      .addSelect(raw(`lang_value->>"$.${langCode}" AS ${langCode}`))
      .execute('all')

    return result.reduce((acc, cur) => {
      acc[cur.langKey] = cur[langCode]
      return acc
    }, {})
  }

  async findByKey(dto: FindSystemLangOneReqDto) {
    const result = await this.em.find(SysLangEntity, {
      langKey: dto.langKey,
    })

    return result
  }

  async findPage(dto: FindSystemLangPageReqDto) {
    const { page, pageSize, ...rest } = dto

    const [data, total] = await this.em.findAndCount(SysLangEntity, {
      $and: [
        {
          langKey: rest.langKey
            ? { $like: `%${rest.langKey}%` }
            : {},
        },
        {
          remark: rest.remark
            ? { $like: `%${rest.remark}%` }
            : {},
        },
        {
          isBuiltin: rest.isBuiltin
            ? { $eq: rest.isBuiltin }
            : {},
        },
        {
          isAvailable: rest.isAvailable
            ? { $eq: rest.isAvailable }
            : {},
        },
        {
          createdAt: rest.beginTime
            ? { $gte: rest.beginTime, $lte: rest.endTime }
            : {},
        },
      ],
    }, { limit: pageSize, offset: page - 1 })

    return { page, pageSize, data, total }
  }

  async remove(dto: RemoveReqDto) {
    const { ids } = dto

    const oldRecords = await this.em.find(SysLangEntity, {
      id: { $in: ids },
    })

    await this.em.remove(oldRecords).flush()
  }

  async update(dto: UpdateSystemLangReqDto) {
    const { id, langKey, ...rest } = dto

    const oldRecord = await this.em.findOne(SysLangEntity, {
      $and: [
        {
          id: { $eq: id },
        },
        {
          langKey: { $eq: langKey },
        },
      ],
    })

    if (!oldRecord) {
      throw new BadRequestException(ErrorEnum.label(ErrorEnum.LANG_NOT_FOUND_ERROR))
    }

    wrap(oldRecord).assign(rest)
    this.contextService.bindCurrentUserToEntity(oldRecord, 'update')

    await this.em.persist(oldRecord).flush()
  }

  async translate(dto: TranslateSystemLangReqDto) {
    const inputArray = LangEnum.items
      .filter(item => item.value !== LangEnum.ZH_CN)
      .map(item => ({
        text: dto.text,
        source: LangEnum.item(LangEnum.ZH_CN).code,
        target: item.code,
        targetKey: item.value,
      }))

    const result = await Promise.all(inputArray.map(item => this.remoteTranslateService.trans(item)))

    return result.reduce((acc, cur) => {
      Object.assign(acc, cur)
      return acc
    }, {})
  }

  async importTemplate(data: ImportSystemLangSerDto[]) {
    let fail = 0
    const items: string[] = []
    // 忽略完全空白的行（Excel 末尾常带空行），避免产生虚假失败项
    const rows = data.filter(item =>
      Object.values(item).some(value => value !== undefined && value !== null && value !== ''),
    )
    const langKeys = rows
      .map(item => (item.langKey == null
        ? ''
        : String(item.langKey).trim()))
      .filter(Boolean)

    // 一次性查询已存在的词条，避免逐行查询
    const oldRecords = langKeys.length
      ? await this.em.find(SysLangEntity, {
          langKey: { $in: langKeys },
        })
      : []
    const existKeys = new Set(oldRecords.map(item => item.langKey))
    // 防止同一个文件内出现重复的 langKey
    const handledKeys = new Set<string>()

    for (const item of rows) {
      const langKey = item.langKey == null
        ? ''
        : String(item.langKey).trim()

      if (!langKey || existKeys.has(langKey) || handledKeys.has(langKey)) {
        items.push(langKey || '(空)')
        fail++
        continue
      }

      handledKeys.add(langKey)

      // 每种语言对应模板中的一列，这里重新组装成 langValue JSON
      const row = item as unknown as Record<string, unknown>
      const langValue = LangEnum.items.reduce((acc, lang) => {
        const value = row[lang.value]
        if (value !== undefined && value !== null && value !== '') {
          acc[lang.value] = String(value)
        }
        return acc
      }, {} as Record<ILangEnum, string>)

      const lang = this.em.create(SysLangEntity, {
        langKey,
        langValue,
        remark: item.remark
          ? String(item.remark)
          : undefined,
        isBuiltin: YesOrNoEnum.NO,
        isAvailable: YesOrNoEnum.YES,
      })
      this.contextService.bindCurrentUserToEntity(lang, 'create')
      this.em.persist(lang)
    }

    await this.em.flush()

    return {
      success: rows.length - fail,
      fail,
      items,
    }
  }
}
