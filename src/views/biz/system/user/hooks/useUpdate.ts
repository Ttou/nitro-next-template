import type { FieldValues, PlusColumn, PlusDialogProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { UpdateSystemUserReqDto } from '~web/apis'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { systemUserApi } from '~web/apis'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useUpdate({ pageInstance, columns }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref<UpdateSystemUserReqDto>({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: '编辑用户',
    width: '900px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  // @ts-ignore
  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    colProps: {
      span: 12,
    },
    columns: unref(columns),
    rules: {
      nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
      isAvailable: [{ required: true, message: '请选择是否可用', trigger: 'change' }],
    },
  }))

  function showUpdate(params) {
    Object.assign(updateValues.value, params)
    updateVisible.value = true
  }

  async function confirmUpdate(values: FieldValues) {
    try {
      updateConfirmLoading.value = true

      await systemUserApi.update(values)

      updateValues.value = Object.create({})
      updateVisible.value = false
      updateConfirmLoading.value = false

      ElNotification.success({ title: '通知', message: '编辑成功' })

      pageInstance.value.getList()
    }
    catch (error) {
      updateConfirmLoading.value = false
    }
  }

  return {
    updateVisible,
    updateValues,
    updateDialogProps,
    updateFormProps,
    showUpdate,
    confirmUpdate,
  }
}
