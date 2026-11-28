import { StorageBizEnumValues, StorageVisibilityEnumValues } from '~shared/enums'

/** 正则元字符转义，枚举值将来带上 `.`、`+` 之类字符时正则不会被破坏 */
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** 可见性前缀，如 `public|private` */
const VISIBILITY_PREFIX = StorageVisibilityEnumValues.map(escapeRegExp).join('|')

/** 业务目录，如 `avatars` */
const BIZ_SEGMENT = StorageBizEnumValues.map(escapeRegExp).join('|')

/**
 * UUID v7 字符串
 *
 * `xxxxxxxx-xxxx-7xxx-[89ab]xxx-xxxxxxxxxxxx`：版本位固定 7，变体位为 8/9/a/b。
 */
const UUID_V7_SEGMENT = '[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'

/** 扩展名取自文件头检测结果，可能为空（如 pdf 之外的未知类型） */
const EXTENSION_SEGMENT = '(?:\\.[0-9a-z]+)?'

/**
 * 生成上传对象键
 *
 * 统一格式 `{visibility}/{biz}/{uuid}{ext}`，上传与清理任务共用同一处定义。
 */
export function buildStorageKey(visibility: string, biz: string, id: string, extension: string) {
  return `${visibility}/${biz}/${id}${extension}`
}

/**
 * 是否为上传接口产出的对象键
 *
 * 前缀取自枚举，新增可见性或业务类型后自动纳入，清理任务既不会漏掉新业务的文件，
 * 也不会误伤桶里其他系统写入的数据。
 */
const STORAGE_KEY_PATTERN = new RegExp(`^(?:${VISIBILITY_PREFIX})/(?:${BIZ_SEGMENT})/${UUID_V7_SEGMENT}${EXTENSION_SEGMENT}$`)

export function isManagedStorageKey(key: string) {
  return STORAGE_KEY_PATTERN.test(key)
}
