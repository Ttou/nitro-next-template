import { ElNotification } from 'element-plus'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getTree: () => Promise<void>
}

export function useUpdate({ pageInstance, columns, getTree }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref<UpdateSystemMenuDto>({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: '编辑菜单',
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
      menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
      menuKey: [{ required: true, message: '请输入菜单标识', trigger: 'blur' }],
      menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
      orderNum: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }],
      isAvailable: [{ required: true, message: '请选择是否可用', trigger: 'change' }],
      isFrame: [{ required: true, message: '请选择是否外链', trigger: 'change' }],
      isCache: [{ required: true, message: '请选择是否缓存', trigger: 'change' }],
      isVisible: [{ required: true, message: '请选择是否显示', trigger: 'change' }],
    },
  }))

  async function showUpdate(params) {
    Object.assign(updateValues.value, params)
    updateVisible.value = true

    try {
      await getTree()
      updateConfirmLoading.value = false
    }
    catch (error) {
      updateConfirmLoading.value = false
    }
  }

  async function confirmUpdate(values: FieldValues) {
    try {
      updateConfirmLoading.value = true

      await systemMenuApi.update({
        ...values,
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
    updateDialogProps,
    updateFormProps,
    showUpdate,
    confirmUpdate,
  }
}
