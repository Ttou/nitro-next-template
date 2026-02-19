import type { FieldValues, PlusDialogProps, PlusFormProps } from 'plus-pro-components'
import { ElNotification } from 'element-plus'
import { PlusDialogForm } from 'plus-pro-components'
import { computed, defineComponent, ref, unref } from 'vue'
import { useUserStore } from '~web/store'

export default defineComponent({
  name: 'UpdatePassword',
  setup() {
    const visible = ref(false)
    const formModel = ref<UpdateCurrentUserPasswordDto>()
    const confirmLoading = ref(false)
    const userStore = useUserStore()

    const dialogProps = computed<PlusDialogProps>(() => {
      return {
        title: '修改密码',
        confirmLoading: unref(confirmLoading),
        width: '600px',
      }
    })

    const formProps = computed<PlusFormProps>(() => {
      return {
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

    return {
      visible,
      values: formModel,
      dialogProps,
      formProps,
      open,
      handleConfirm,
    }
  },
  render() {
    return (
      <PlusDialogForm
        v-model:visible={this.visible}
        v-model={this.values}
        dialog={this.dialogProps}
        form={this.formProps}
        onConfirm={this.handleConfirm}
      />
    )
  },
})
