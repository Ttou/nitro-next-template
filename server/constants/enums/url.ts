import { Enum } from 'enum-plus'

export const UrlEnum = Enum({
  IP_PARSER: { value: 'https://zj.v.api.aa1.cn/api/ip-taobao', label: 'IP解析' },
  TRANSLATE: { value: 'https://api.qvqa.cn/api/fanyi', label: '翻译' },
})
