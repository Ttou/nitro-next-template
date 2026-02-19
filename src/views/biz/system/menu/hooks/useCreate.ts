import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getTree: () => Promise<void>
}

export function useCreate({ pageInstance, columns, getTree }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref<CreateSystemMenuDto>({})
  const createConfirmLoading = ref(false)

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: '新增菜单',
    width: '900px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
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

  async function showCreate() {
    createVisible.value = true
    createConfirmLoading.value = true

    try {
      await getTree()
      createConfirmLoading.value = false
    }
    catch (error) {
      createConfirmLoading.value = false
    }
  }

  async function confirmCreate(values: FieldValues) {
    try {
      createConfirmLoading.value = true

      await systemMenuApi.create(values)

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
    createDialogProps,
    createFormProps,
    showCreate,
    confirmCreate,
  }
}
