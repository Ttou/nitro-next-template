import type { PlusColumn, PlusDrawerFormProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { CreateSystemLangReqDto } from '~web/apis/globals'
import { ElButton, ElNotification } from 'element-plus'
import { pick } from 'es-toolkit'
import { computed, h, ref, unref } from 'vue'
import { LangEnum } from '~shared/enums'
import { t } from '~web/i18n'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
}

export function useCreate({ pageInstance, columns }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref<CreateSystemLangReqDto>({})
  const createConfirmLoading = ref(false)

  const createDrawerProps = computed<PlusDrawerFormProps>(() => ({
    title: t('system.lang.dialog.create'),
    width: '700px',
    confirmLoading: unref(createConfirmLoading),
    destroyOnClose: true,
  }))

  const createFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '100px',
    labelPosition: 'right',
    columns: [
      ...[],
      ...unref(columns),
      ...LangEnum.items.map((v) => {
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
                  Apis.SystemLang.translate({
                    data: { text: createValues.value[v.value] },
                  }).then((res) => {
                    Object.keys(res).forEach((key) => {
                      createValues.value[key] = res[key]
                    })
                  })
                },
              },
              () => t('system.lang.button.translate'),
            ),
          }
        }

        return column
      }),
    ],
    rules: {
      langKey: [
        {
          required: true,
          message: t('common.validation.inputLangKey'),
          trigger: 'blur',
        },
      ],
      isBuiltin: [
        {
          required: true,
          message: t('common.validation.selectIsBuiltin'),
          trigger: 'change',
        },
      ],
      isAvailable: [
        {
          required: true,
          message: t('common.validation.selectIsAvailable'),
          trigger: 'change',
        },
      ],
    },
  }))

  const langValue = computed(() => {
    return pick(createValues.value, LangEnum.values)
  })

  function showCreate() {
    createVisible.value = true
  }

  async function confirmCreate(values) {
    try {
      createConfirmLoading.value = true

      await Apis.SystemLang.create({
        data: {
          ...values,
          langValue: langValue.value,
        },
      })

      createValues.value = Object.create({})
      createVisible.value = false
      createConfirmLoading.value = false

      ElNotification.success({
        title: t('common.title.notification'),
        message: t('common.message.createSuccess'),
      })

      pageInstance.value.getList()
    }
    catch (error) {
      createConfirmLoading.value = false
    }
  }

  function cancelCreate() {
    createValues.value = Object.create({})
    createConfirmLoading.value = false
  }

  return {
    createVisible,
    createValues,
    createDrawerProps,
    createFormProps,
    showCreate,
    confirmCreate,
    cancelCreate,
  }
}
