import type { ValidationArguments, ValidationOptions } from 'class-validator'
import { registerDecorator } from 'class-validator'

export const IS_EQUAL = 'isEqual'

export function IsEqual(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: IS_EQUAL,
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // 获取要比较的另一个属性的名称
          const [relatedPropertyName] = args.constraints
          // 获取另一个属性的值
          const relatedValue = (args.object as any)[relatedPropertyName]
          // 比较当前值是否与另一个属性值相等
          return value === relatedValue
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          return `$property must equal to ${relatedPropertyName} exactly`
        },
      },
    })
  }
}
