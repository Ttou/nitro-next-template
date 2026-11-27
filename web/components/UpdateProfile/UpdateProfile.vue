<script setup lang="ts">
import type { UploadRawFile } from 'element-plus'
import type { PlusDrawerFormProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { ElAvatar, ElMessage, ElNotification, ElUpload } from 'element-plus'
import { pick } from 'es-toolkit/compat'
import { computed, h, ref, unref } from 'vue'
import { useDict } from '~web/hooks'
import { dictToOptions } from '~web/utils'

defineOptions({
  name: 'UpdateProfile',
})

const AVATAR_MAX_SIZE = 5 * 1024 * 1024

const visible = ref(false)
const formModel = ref({})
const confirmLoading = ref(false)
const uploading = ref(false)

const dict = useDict(['sys.user.sex'])

const sexDictOptions = computed(() => dictToOptions(dict.value.get('sys.user.sex')))

function handleAvatarChange(file: UploadRawFile, onChange: (value: unknown) => void) {
  if (file.size > AVATAR_MAX_SIZE) {
    ElMessage.error('头像不能超过 5MB')
    return false
  }

  uploading.value = true

  Apis.Storage.upload({
    data: { file },
  })
    .then((res) => {
      onChange(res.url)
    })
    .finally(() => {
      uploading.value = false
    })

  return false
}

const drawerProps = computed<PlusDrawerFormProps>(() => {
  return {
    title: '更新个人信息',
    confirmLoading: unref(confirmLoading) || unref(uploading),
    form: {
      labelWidth: 80,
      labelPosition: 'right',
      columns: [
        {
          label: '头像',
          prop: 'avatar',
          formItemProps: {
            class: 'avatar-form-item',
          },
          renderField: (value, onChange) => h(
            ElUpload,
            {
              class: 'avatar-uploader',
              accept: 'image/jpeg,image/png,image/gif,image/webp,image/avif',
              showFileList: false,
              beforeUpload: (file: UploadRawFile) => handleAvatarChange(file, onChange),
            },
            () => h(
              ElAvatar,
              {
                class: 'avatar-uploader__avatar',
                src: typeof value === 'string' && value
                  ? value
                  : undefined,
                size: 80,
                fit: 'cover',
                alt: '头像',
              },
              () => h(Icon, { icon: 'ep:plus', class: 'avatar-uploader__icon' }),
            ),
          ),
        },
        {
          label: '用户昵称',
          prop: 'nickName',
        },
        {
          label: '手机',
          prop: 'phone',
        },
        {
          label: '邮箱',
          prop: 'email',
        },
        {
          label: '性别',
          prop: 'sex',
          valueType: 'select',
          options: sexDictOptions,
        },
      ],
      rules: {
        sex: {
          required: true,
          message: '请选择性别',
          trigger: 'blur',
        },
      },
    },
    closeOnClickModal: true,
  }
})

function open() {
  visible.value = true
  confirmLoading.value = true

  Apis.CurrentUser.getProfile()
    .then((res) => {
      Object.assign(formModel.value, pick(res, [
        'avatar',
        'nickName',
        'phone',
        'email',
        'sex',
      ]))
    })
    .finally(() => {
      confirmLoading.value = false
    })
}

function handleConfirm(values: any) {
  confirmLoading.value = true

  Apis.CurrentUser.updateProfile({ data: values })
    .then(() => {
      visible.value = false
      ElNotification.success({
        title: '通知',
        message: '修改成功',
      })
    })
    .finally(() => {
      confirmLoading.value = false
    })
}

defineExpose({
  open,
})
</script>

<template>
  <plus-drawer-form
    v-model:visible="visible"
    v-model="formModel"
    v-bind="drawerProps"
    @confirm="handleConfirm"
  />
</template>

<style>
.avatar-form-item {
  align-items: center;
}

.avatar-uploader .el-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader__avatar {
  --el-avatar-bg-color: transparent;
}

.avatar-uploader__icon {
  font-size: 24px;
  color: var(--el-text-color-placeholder);
}
</style>
