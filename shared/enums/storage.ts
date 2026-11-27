import { Enum } from 'enum-plus'

export const StorageVisibilityEnum = Enum({
  PUBLIC: { label: '公开', value: 'public' },
  PRIVATE: { label: '私密', value: 'private' },
} as const)

export const StorageVisibilityEnumValues = StorageVisibilityEnum.values

export type IStorageVisibilityEnum = typeof StorageVisibilityEnum.valueType

export const StorageBizEnum = Enum({
  AVATAR: { label: '头像', value: 'avatars' },
} as const)

export const StorageBizEnumValues = StorageBizEnum.values

export type IStorageBizEnum = typeof StorageBizEnum.valueType
