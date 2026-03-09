import type { PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
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

  return {
    importVisible,
    importValues,
    importDialogProps,
    importFormProps,
    importTemplateLoading,
    exportTemplateLoading,
    showImport,
    exportTemplate,
  }
}
