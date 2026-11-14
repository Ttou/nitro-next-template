import type { UploadRequestOptions } from 'element-plus'
import type { PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'
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
    title: t('system.user.dialog.import'),
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
        label: t('common.import.template'),
        prop: 'template',
      },
      {
        label: t('common.import.file'),
        prop: 'file',
      },
    ],
    rules: {
      file: [
        {
          required: true,
          message: t('common.validation.uploadFile'),
          trigger: 'blur',
        },
      ],
    },
  }))

  function showImport() {
    importVisible.value = true
  }

  function exportTemplate() {
    exportTemplateLoading.value = true
    Apis.SystemUser.exportTemplate({
      responseType: 'blob',
    }).then((res) => {
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

      const res = await Apis.SystemUser.importTemplate({
        data: formData,
      })
      ElNotification.info({
        title: t('common.import.result'),
        message: t('system.user.message.importResult', { success: res.success, fail: res.fail }),
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
      ElMessage.error(t('common.upload.excelOnly'))
      return false
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      ElMessage.error(t('common.upload.fileSizeLimit'))
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
