import type { FindSystemDictDetailByKeyResDto } from '~web/apis/globals'

/**
 * 字典转选项
 * @param dict
 */
export function dictToOptions(dict: FindSystemDictDetailByKeyResDto[]) {
  if (!dict) {
    return []
  }
  return dict.map(item => ({
    label: item.dictLabel,
    value: item.dictValue,
  }))
}
