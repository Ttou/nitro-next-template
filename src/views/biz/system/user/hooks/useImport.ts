import type { UploadRequestOptions } from 'element-plus'
import type { PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { systemUserApi } from '~web/apis'
import { download } from '~web/utils'

interface UseImportParams {
  pageInstance: Ref<PlusPageInstance>
}

export function useImport({ pageInstance }: UseImportParams) {
  const importVisible = ref(false)
  const importValues = ref({})
  const exportTemplateLoading = ref(false)
  const importTemplateLoading = ref(false)

  const importDialogProps = computed<PlusDialogProps>(() => ({
    title: '导入用户',
    width: '600px',
    confirmLoading: unref(importTemplateLoading),
    destroyOnClose: true,
    hasFooter: false,
  }))

  const importFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    colProps: {
      span: 24,
    },
    columns: [
      {
        label: '导入模板',
        prop: 'template',
      },
      {
        label: '导入文件',
        prop: 'file',
      },
    ],
    rules: {
      file: [{ required: true, message: '请上传文件', trigger: 'blur' }],
    },
  }))

  function showImport() {
    importVisible.value = true
  }

  function exportTemplate() {
    exportTemplateLoading.value = true
    systemUserApi.exportTemplate().then((res) => {
      download(res)
    }).finally(() => {
      exportTemplateLoading.value = false
    })
  }

  async function httpRequest(options: UploadRequestOptions) {
    const { file, onSuccess, onError } = options
    importTemplateLoading.value = true

    try {
      const formData = new FormData()
      formData.append('file', file as File)

      const res = await systemUserApi.importTemplate(formData)
      ElNotification.info({
        title: '导入结果',
        message: `成功导入 ${res.success} 条记录，失败 ${res.fail} 条记录。`,
      })
      onSuccess?.(res)
      importVisible.value = false
      pageInstance.value?.getList()
    }
    catch (error) {
      onError?.(error)
    }
    finally {
      importTemplateLoading.value = false
    }
  }

  function beforeUpload(file: File) {
    const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!isExcel) {
      ElMessage.error('只能上传 Excel 文件!')
      return false
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      ElMessage.error('上传文件大小不能超过 10MB!')
      return false
    }
    return true
  }

  return {
    importVisible,
    importValues,
    importDialogProps,
    importFormProps,
    importTemplateLoading,
    exportTemplateLoading,
    showImport,
    exportTemplate,
    httpRequest,
    beforeUpload,
  }
}
