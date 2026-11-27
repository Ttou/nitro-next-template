import type { FormItemRule, FormRules } from 'element-plus'
import type { z } from 'zod'

/**
 * 用 zod schema 生成 element-plus 表单规则
 *
 * 每个字段只取 schema 中对应字段单独校验，保留 blur/change 触发与行内错误提示；
 * 未渲染 form-item 的字段不会参与校验（如隐藏的 captchaId）。
 *
 * @param schema 字段与表单 model 同构的 zod object schema
 */
export function zodFormRules<S extends z.ZodObject>(schema: S): FormRules<z.infer<S>> {
  const rules: Record<string, FormItemRule[]> = {}

  for (const [key, field] of Object.entries(schema.shape)) {
    rules[key] = [
      {
        trigger: ['blur', 'change'],
        validator: (_rule, value, callback) => {
          const result = (field as z.ZodType).safeParse(value)

          if (result.success) {
            callback()
          }
          else {
            callback(new Error(result.error.issues[0]?.message ?? '格式不正确'))
          }
        },
      },
    ]
  }

  return rules as FormRules<z.infer<S>>
}
