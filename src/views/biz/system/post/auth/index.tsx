import { Icon } from '@iconify/vue'
import { ElButton, ElMessage, ElMessageBox, ElNotification, ElSpace } from 'element-plus'

import { useCreate } from './hooks/useCreate'

export default defineComponent({
  setup() {
    const pageInstance = ref<PlusPageInstance>()
    const selectedIds = ref<string[]>([])

    const route = useRoute()

    const id = computed(() => route.query.id as string)

    // @ts-ignore
    const plusPageProps = computed<PlusPageProps>(() => {
      return {
        columns: [
          {
            label: '账号',
            prop: 'userName',
            tableColumnProps: {
              align: 'center',
            },
          },
          {
            label: '昵称',
            prop: 'nickName',
            tableColumnProps: {
              align: 'center',
            },
          },
          {
            label: '手机',
            prop: 'phone',
            hideInSearch: true,
            tableColumnProps: {
              align: 'center',
            },
          },
          {
            label: '邮箱',
            prop: 'email',
            hideInSearch: true,
            tableColumnProps: {
              align: 'center',
            },
          },
          {
            label: '是否可用',
            prop: 'isAvailable',
            valueType: 'select',
            options: YesOrNoEnum.items,
            hideInSearch: true,
            tableColumnProps: {
              align: 'center',
            },
          },
          {
            label: '创建时间',
            prop: 'createdAt',
            valueType: 'date-picker',
            hideInSearch: true,
            width: 180,
            tableColumnProps: {
              align: 'center',
            },
          },
          {
            label: '更新时间',
            prop: 'updatedAt',
            valueType: 'date-picker',
            hideInSearch: true,
            width: 180,
            tableColumnProps: {
              align: 'center',
            },
          },
        ],
        search: {
          showNumber: 3,
        },
        table: {
          adaptive: true,
          hasIndexColumn: true,
          isSelection: true,
          indexTableColumnProps: {
            label: '序号',
          },
          actionBar: {
            actionBarTableColumnProps: {
              align: 'center',
            },
            buttons: [
              {
                text: '取消授权',
                code: 'cancel',
                props: { type: 'danger' },
                confirm: {
                  message: ({ row }) => `确定取消授权【${row.userName}】吗？`,
                  options: {
                    type: 'warning',
                  },
                },
                onConfirm({ row }) {
                  confirmRemove([row.id])
                },
              },
            ],
          },
          onSelectionChange: (data: any[]) => {
            selectedIds.value = [...data].map(item => item.id)
          },
        },
        request: async (params) => {
          return await systemPostAuthApi.findAllocatedUserPage({
            id: unref(id),
            ...params,
          })
        },
        searchCardProps: {
          shadow: 'never',
        },
        tableCardProps: {
          shadow: 'never',
        },
      }
    })

    const createHook = useCreate({ pageInstance, id })

    function confirmRemove(ids: string[], batch: boolean = false) {
      const handler = () => systemPostAuthApi.unallocateUser({
        id: unref(id),
        ids,
      })
        .then(() => {
          ElNotification.success({ title: '通知', message: '取消授权成功' })
          pageInstance.value.getList()
        })

      if (batch) {
        if (!selectedIds.value.length) {
          ElMessage.warning('请选择要取消授权的数据')
          return
        }

        ElMessageBox.confirm('确定取消授权选中的数据吗？', {
          type: 'warning',
          title: '提示',
        })
          .then(() => {
            handler()
          }).catch(() => {})
      }
      else {
        handler()
      }
    }

    return {
      pageInstance,
      plusPageProps,
      selectedIds,
      confirmRemove,
      ...createHook,
    }
  },
  render() {
    return (
      <div>
        <PlusPage
          ref="pageInstance"
          {...this.plusPageProps}
        >
          {{
            ['table-title']: () => (
              <ElSpace>
                <ElButton
                  type="primary"
                  icon={<Icon icon="ep:plus" />}
                  onClick={this.showCreate}
                >
                  添加授权
                </ElButton>
                <ElButton
                  type="danger"
                  icon={<Icon icon="ep:delete" />}
                  onClick={() => this.confirmRemove(this.selectedIds, true)}
                >
                  批量取消授权
                </ElButton>
              </ElSpace>
            ),
          }}
        </PlusPage>
        <PlusDialog
          v-model={this.createVisible}
          {...this.createDialogProps}
          onConfirm={this.confirmCreate}
        >
          <PlusPage {...this.createPageProps} />
        </PlusDialog>
      </div>
    )
  },
})
