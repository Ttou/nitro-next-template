import { ElNotification } from 'element-plus'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getDeptTree: () => Promise<void>
}

export function useUpdate({ pageInstance, columns, getDeptTree }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: '编辑部门',
    width: '700px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  // @ts-ignore
  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: unref(columns),
    rules: {
      deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      deptKey: [{ required: true, message: '请输入部门标识', trigger: 'blur' }],
      isAvailable: [{ required: true, message: '请选择是否可用', trigger: 'change' }],
    },
  }))

  async function showUpdate(params) {
    Object.assign(updateValues.value, params)
    updateVisible.value = true

    updateConfirmLoading.value = true

    try {
      await getDeptTree()
      updateConfirmLoading.value = false
    }
    catch (error) {
      updateConfirmLoading.value = false
    }
  }

  async function confirmUpdate(values: FieldValues) {
    try {
      updateConfirmLoading.value = true

      await systemDeptApi.update(values)

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
