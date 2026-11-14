import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { UpdateSystemMenuReqDto } from '~web/apis/globals'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseUpdateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getTree: () => Promise<void>
}

export function useUpdate({ pageInstance, columns, getTree }: UseUpdateParams) {
  const updateVisible = ref(false)
  const updateValues = ref<UpdateSystemMenuReqDto>({})
  const updateConfirmLoading = ref(false)

  const updateDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.menu.dialog.update'),
    width: '900px',
    confirmLoading: unref(updateConfirmLoading),
    destroyOnClose: true,
  }))

  const updateFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    colProps: {
      span: 12,
    },
    columns: unref(columns),
    rules: {
      menuName: [
        {
          required: true,
          message: t('common.validation.inputMenuName'),
          trigger: 'blur',
        },
      ],
      menuKey: [
        {
          required: true,
          message: t('common.validation.inputMenuKey'),
          trigger: 'blur',
        },
      ],
      menuType: [
        {
          required: true,
          message: t('common.validation.selectMenuType'),
          trigger: 'change',
        },
      ],
      orderNum: [
        {
          required: true,
          message: t('common.validation.inputMenuSort'),
          trigger: 'blur',
        },
      ],
      isAvailable: [
        {
          required: true,
          message: t('common.validation.selectIsAvailable'),
          trigger: 'change',
        },
      ],
      isFrame: [
        {
          required: true,
          message: t('common.validation.selectIsExternal'),
          trigger: 'change',
        },
      ],
      isCache: [
        {
          required: true,
          message: t('common.validation.selectIsCache'),
          trigger: 'change',
        },
      ],
      isVisible: [
        {
          required: true,
          message: t('common.validation.selectIsVisible'),
          trigger: 'change',
        },
      ],
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

      await Apis.SystemMenu.update({ data: values })

      updateValues.value = Object.create({})
      updateVisible.value = false
      updateConfirmLoading.value = false

      ElNotification.success({
        title: t('common.title.notification'),
        message: t('common.message.updateSuccess'),
      })

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
