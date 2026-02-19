import { ElNotification } from 'element-plus'
import { pick } from 'es-toolkit'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useUpdate({ pageInstance, columns }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref<UpdateSystemLangDto>({})
  const updateConfirmLoading = ref(false)

  const updateDrawerProps = computed<PlusDialogProps>(() => ({
    title: '编辑词条',
    width: '700px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  // @ts-ignore
  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '100px',
    labelPosition: 'right',
    columns: [].concat(unref(columns), LangEnum.items.map(v => ({
      label: v.label,
      prop: v.value,
    }))),
    rules: {
      isBuiltin: [{ required: true, message: '请选择系统内置', trigger: 'change' }],
      isAvailable: [{ required: true, message: '请选择是否可用', trigger: 'change' }],
    },
  }))

  const langValue = computed(() => {
    return JSON.stringify(pick(updateValues.value, LangEnum.values))
  })

  function showUpdate(params) {
    Object.assign(updateValues.value, params, JSON.parse(params.langValue))
    updateVisible.value = true
  }

  async function confirmUpdate(values) {
    try {
      updateConfirmLoading.value = true

      await systemLangApi.update({
        ...values,
        langValue: langValue.value,
      })

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
    updateDrawerProps,
    updateFormProps,
    showUpdate,
    confirmUpdate,
  }
}
