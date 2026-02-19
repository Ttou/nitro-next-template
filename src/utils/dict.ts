/**
 * 字典转选项
 * @param dict
 */
export function dictToOptions(dict: SysDictDataEntity[]) {
  if (!dict) {
    return []
  }
  return dict.map(item => ({
    label: item.dictLabel,
    value: item.dictValue,
  }))
}
