<script setup lang="ts">
import type { PlusDrawerFormProps } from 'plus-pro-components'
import { ElNotification } from 'element-plus'
import { pick } from 'es-toolkit/compat'
import { computed, ref, unref } from 'vue'
import { useDict } from '~web/hooks'
import { dictToOptions } from '~web/utils'

defineOptions({
  name: 'UpdateProfile',
})

const visible = ref(false)
const formModel = ref({})
const confirmLoading = ref(false)

const dict = useDict(['sys.user.sex'])

const drawerProps = computed<PlusDrawerFormProps>(() => {
  return {
    title: '更新个人信息',
    confirmLoading: unref(confirmLoading),
    form: {
      labelWidth: 80,
      labelPosition: 'right',
      columns: [
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
          options: dictToOptions(dict.value.get('sys.user.sex')),
        },
      ],
      rules: {
        sex: { required: true, message: '请选择性别', trigger: 'blur' },
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
      Object.assign(formModel.value, pick(res, ['nickName', 'phone', 'email', 'sex']))
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
      ElNotification.success({ title: '通知', message: '修改成功' })
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
