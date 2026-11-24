import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { UpdateSystemPostReqDto } from '~web/apis/globals'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { toPayload } from '~web/utils'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useUpdate({ pageInstance, columns }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: '编辑岗位',
    width: '700px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: unref(columns),
    rules: {
      postName: [
        {
          required: true,
          message: '请输入岗位名称',
          trigger: 'blur',
        },
      ],
      postKey: [
        {
          required: true,
          message: '请输入岗位标识',
          trigger: 'blur',
        },
      ],
      isAvailable: [
        {
          required: true,
          message: '请选择是否可用',
          trigger: 'change',
        },
      ],
    },
  }))

  function showUpdate(params: any) {
    Object.assign(updateValues.value, params)
    updateVisible.value = true
  }

  async function confirmUpdate(values: FieldValues) {
    try {
      updateConfirmLoading.value = true

      await Apis.SystemPost.update({
        data: toPayload<UpdateSystemPostReqDto>(values),
      })

      updateValues.value = Object.create({})
      updateVisible.value = false
      updateConfirmLoading.value = false

      ElNotification.success({
        title: '通知',
        message: '编辑成功',
      })

      pageInstance.value.getList()
    }
    catch {
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
