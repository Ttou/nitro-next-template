import { ref } from 'vue'

export function useDict(dictTypes: string[] = []) {
  const dict = ref<Map<string, SysDictDataEntity[]>>(new Map())

  Promise.all(dictTypes.map(dictType => systemDictTypeApi.findByKey({ dictType }))).then((values) => {
    for (const value of values) {
      dict.value.set(value[0].dictType, value)
    }
  })

  return dict
}
