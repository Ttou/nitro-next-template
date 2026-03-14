import type { FindSystemDictDetailByKeyResDto } from '~web/apis/globals'
import { ref } from 'vue'

export function useDict(dictTypes: string[] = []) {
  const dict = ref<Map<string, FindSystemDictDetailByKeyResDto[]>>(new Map())

  Promise.all(dictTypes.map(dictType => Apis.SystemDictType.findByKey({ params: { dictType } }))).then((values) => {
    for (const value of values) {
      dict.value.set(value[0].dictType, value)
    }
  })

  return dict
}
