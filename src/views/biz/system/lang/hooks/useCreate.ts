import { ElNotification } from 'element-plus'
import { pick } from 'es-toolkit'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useCreate({ pageInstance, columns }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref<CreateSystemLangDto>({})
  const createConfirmLoading = ref(false)

  const createDrawerProps = computed<PlusDrawerFormProps>(() => ({
    title: '新增词条',
    width: '700px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '100px',
    labelPosition: 'right',
    columns: [].concat(unref(columns), LangEnum.items.map(v => ({
      label: v.label,
      prop: v.value,
    }))),
    rules: {
      langKey: [{ required: true, message: '请输入词条标识', trigger: 'blur' }],
      isBuiltin: [{ required: true, message: '请选择系统内置', trigger: 'change' }],
      isAvailable: [{ required: true, message: '请选择是否可用', trigger: 'change' }],
    },
  }))

  const langValue = computed(() => {
    return JSON.stringify(pick(createValues.value, LangEnum.values))
  })

  function showCreate() {
    createVisible.value = true
  }

  async function confirmCreate(values) {
    try {
      createConfirmLoading.value = true

      await systemLangApi.create({
        ...values,
        langValue: langValue.value,
      })

      createValues.value = Object.create({})
      createVisible.value = false
      createConfirmLoading.value = false

      ElNotification.success({ title: '通知', message: '新增成功' })

      pageInstance.value.getList()
    }
    catch (error) {
      createConfirmLoading.value = false
    }
  }

  return {
    createVisible,
    createValues,
    createDrawerProps,
    createFormProps,
    showCreate,
    confirmCreate,
  }
}
