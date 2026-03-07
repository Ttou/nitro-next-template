<script setup lang="ts">
import type { FieldValues, PlusDrawerFormProps } from 'plus-pro-components'
import type { UpdateCurrentUserPasswordReqDto } from '~web/apis'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { currentUserApi } from '~web/apis'
import { useUserStore } from '~web/store'

defineOptions({
  name: 'UpdatePassword',
})

const visible = ref(false)
const formModel = ref<UpdateCurrentUserPasswordReqDto>()
const confirmLoading = ref(false)
const userStore = useUserStore()

const drawerProps = computed<PlusDrawerFormProps>(() => {
  return {
    title: '修改密码',
    confirmLoading: unref(confirmLoading),
    width: '600px',
    form: {
      labelWidth: 120,
      labelPosition: 'right',
      columns: [
        {
          label: '旧密码',
          prop: 'oldPassword',
          fieldProps: {
            type: 'password',
            showPassword: true,
          },
        },
        {
          label: '新密码',
          prop: 'newPassword',
          fieldProps: {
            type: 'password',
            showPassword: true,
          },
        },
        {
          label: '确认密码',
          prop: 'confirmPassword',
          fieldProps: {
            type: 'password',
            showPassword: true,
          },
        },
      ],
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
      },
    },
  }
})

function open() {
  visible.value = true
}

async function handleConfirm(values: FieldValues) {
  try {
    confirmLoading.value = true

    await currentUserApi.updatePassword(values)

    formModel.value = Object.create({})
    visible.value = false
    confirmLoading.value = false

    ElNotification.success({
      title: '通知',
      message: '修改成功，请重新登录',
      onClose: async () => {
        await userStore.logout()
      },
    })
  }
  catch (error) {
    confirmLoading.value = false
  }
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
