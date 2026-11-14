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
    title: t('system.lang.dialog.import'),
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
    Apis.SystemLang.exportTemplate({
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
      // createApis 会自动把含 Blob 的普通对象转换成 FormData
      const res = await Apis.SystemLang.importTemplate({
        data: { file: file as File },
      })
      const failItems = res.items.slice(0, 10).join('、')
      const more = res.items.length > 10
        ? ` ${t('system.lang.message.moreCount', { count: res.items.length })}`
        : ''
      ElNotification.info({
        title: t('common.import.result'),
        message: [
          t('system.lang.message.importResult', { success: res.success, fail: res.fail }),
          res.items.length
            ? t('system.lang.message.importFailDetail', { items: `${failItems}${more}` })
            : '',
        ].filter(Boolean).join(' '),
      })
      onSuccess?.(res)
      importVisible.value = false
      pageInstance.value?.getList()
    }
    catch (error) {
      onError?.(error as Parameters<NonNullable<typeof onError>>[0])
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
