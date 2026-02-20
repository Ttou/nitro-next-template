import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { systemDeptApi } from '~web/apis'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getDeptTree: () => Promise<void>
}

export function useCreate({ pageInstance, columns, getDeptTree }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref({})
  const createConfirmLoading = ref(false)

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: '新增部门',
    width: '700px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: unref(columns),
    rules: {
      deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      deptKey: [{ required: true, message: '请输入部门标识', trigger: 'blur' }],
      isAvailable: [{ required: true, message: '请选择是否可用', trigger: 'change' }],
    },
  }))

  async function showCreate() {
    createVisible.value = true
    createConfirmLoading.value = true

    try {
      await getDeptTree()
      createConfirmLoading.value = false
    }
    catch (error) {
      createConfirmLoading.value = false
    }
  }

  async function confirmCreate(values: FieldValues) {
    try {
      createConfirmLoading.value = true

      await systemDeptApi.create(values)

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
