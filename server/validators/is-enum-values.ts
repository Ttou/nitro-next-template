import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

export const IS_ENUM_VALUES = 'isEnumValues'

export function IsEnumValues(values: any[], validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: IS_ENUM_VALUES,
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return values.includes(value)
        },
      },
    })
  }
}
