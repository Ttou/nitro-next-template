<script setup lang="ts">
import type { FieldValues, PlusDrawerFormProps } from 'plus-pro-components'
import type { UpdateCurrentUserPasswordReqDto } from '~web/apis/globals'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'
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
    title: t('profile.password.title'),
    confirmLoading: unref(confirmLoading),
    width: '600px',
    form: {
      labelWidth: 120,
      labelPosition: 'right',
      columns: [
        {
          label: t('profile.oldPassword'),
          prop: 'oldPassword',
          fieldProps: {
            type: 'password',
            showPassword: true,
          },
        },
        {
          label: t('profile.newPassword'),
          prop: 'newPassword',
          fieldProps: {
            type: 'password',
            showPassword: true,
          },
        },
        {
          label: t('profile.confirmPassword'),
          prop: 'confirmPassword',
          fieldProps: {
            type: 'password',
            showPassword: true,
          },
        },
      ],
      rules: {
        oldPassword: [
          {
            required: true,
            message: t('common.validation.inputOldPassword'),
            trigger: 'blur',
          },
        ],
        newPassword: [
          {
            required: true,
            message: t('common.validation.inputNewPassword'),
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: t('common.validation.inputConfirmPassword'),
            trigger: 'blur',
          },
        ],
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

    await Apis.CurrentUser.updatePassword({ data: values })

    formModel.value = Object.create({})
    visible.value = false
    confirmLoading.value = false

    ElNotification.success({
      title: t('common.title.notification'),
      message: t('common.message.passwordChangedRelogin'),
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
