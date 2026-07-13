import type { PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { UpdateSystemLangReqDto } from '~web/apis/globals'
import { ElButton, ElNotification } from 'element-plus'
import { pick } from 'es-toolkit'
import { computed, h, ref, unref } from 'vue'
import { LangEnum } from '~shared/enums'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useUpdate({ pageInstance, columns }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref<UpdateSystemLangReqDto>({})
  const updateConfirmLoading = ref(false)

  const updateDrawerProps = computed<PlusDialogProps>(() => ({
    title: '编辑词条',
    width: '700px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '100px',
    labelPosition: 'right',
    columns: [...[], ...unref(columns), ...LangEnum.items.map((v) => {
      const column: PlusColumn = {
        label: v.label,
        prop: v.value,
      }

      if (v.value === 'zh_CN') {
        column.fieldSlots = {
          append: () => h(
            ElButton,
            {
              onClick: () => {
                Apis.SystemLang.translate({ data: { text: updateValues.value[v.value] } }).then((res) => {
                  Object.keys(res).forEach((key) => {
                    updateValues.value[key] = res[key]
                  })
                })
              },
            },
            () => '翻译 ',
          ),
        }
      }

      return column
    })],
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

      await Apis.SystemLang.update({
        data: {
          ...values,
          langValue: langValue.value,
        },
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

  function cancelUpdate() {
    updateValues.value = Object.create({})
    updateConfirmLoading.value = false
  }

  return {
    updateVisible,
    updateValues,
    updateDrawerProps,
    updateFormProps,
    showUpdate,
    confirmUpdate,
    cancelUpdate,
  }
}
