import type { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    if (value === null || value === undefined) {
      throw new UnprocessableEntityException('请求体不能为空')
    }

    const filteredValue = this.filterDtoFields(value, metatype)
    const object = plainToInstance(metatype, filteredValue)
    const errors = await validate(object, { stopAtFirstError: true })

    if (errors.length > 0) {
      const errorMsg = Object.values(errors[0]!.constraints!)[0]
      throw new UnprocessableEntityException(errorMsg)
    }
    return filteredValue
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }

  private filterDtoFields(value: any, metatype: any): any {
    if (!value || typeof value !== 'object') {
      return value
    }

    const instance = plainToInstance(metatype, {}) as object
    const dtoFields = Object.keys(instance)

    const filtered: any = {}
    dtoFields.forEach((field) => {
      if (field in value) {
        filtered[field] = value[field]
      }
    })

    return filtered
  }
}
