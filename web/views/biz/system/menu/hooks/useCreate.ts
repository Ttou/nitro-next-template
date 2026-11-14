import type { FieldValues, PlusColumn, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { ComputedRef, Ref } from 'vue'
import type { CreateSystemMenuReqDto } from '~web/apis/globals'
import { ElNotification } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { t } from '~web/i18n'

interface UseCreateParams {
  pageInstance: Ref<PlusPageInstance>
  columns: ComputedRef<PlusColumn[]>
  getTree: () => Promise<void>
}

export function useCreate({ pageInstance, columns, getTree }: UseCreateParams) {
  const createVisible = ref(false)
  const createValues = ref<CreateSystemMenuReqDto>({})
  const createConfirmLoading = ref(false)

  const createDialogProps = computed<PlusDialogProps>(() => ({
    title: t('system.menu.dialog.create'),
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

      await Apis.SystemMenu.create({ data: values })

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

  return {
    createVisible,
    createValues,
    createDialogProps,
    createFormProps,
    showCreate,
    confirmCreate,
  }
}
