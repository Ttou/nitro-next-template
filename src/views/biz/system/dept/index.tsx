import type { PlusColumn, PlusPageInstance } from 'plus-pro-components'
import { Icon } from '@iconify/vue'

import { ElButton, ElNotification, ElSpace } from 'element-plus'
import { PlusDialogForm, PlusPage } from 'plus-pro-components'
import { computed, defineComponent, ref, unref } from 'vue'
import { YesOrNoEnum } from '~shared/enums'
import { listToTree } from '~web/utils'
import { useCreate, useUpdate } from './hooks'

export default defineComponent({
  setup() {
    const pageInstance = ref<PlusPageInstance>()
    const deptTree = ref<any[]>([])

    const columns = computed<PlusColumn[]>(() => [
      {
        label: '上级部门',
        prop: 'parentId',
        valueType: 'tree-select',
        fieldProps: {
          data: unref(deptTree),
          nodeKey: 'id',
          props: {
            label: 'deptName',
            children: 'children',
          },
          checkStrictly: true,
          filterable: true,
        },
        hideInSearch: true,
        hideInTable: true,
      },
      {
        label: '部门名称',
        prop: 'deptName',
      },
      {
        label: '部门标识',
        prop: 'deptKey',
        fieldProps: {
          disabled: unref(updateHook.updateVisible),
        },
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '是否可用',
        prop: 'isAvailable',
        valueType: 'select',
        options: YesOrNoEnum.items,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '备注',
        prop: 'remark',
        hideInSearch: true,
        fieldProps: {
          type: 'textarea',
          rows: 3,
        },
        tableColumnProps: {
          align: 'center',
          showOverflowTooltip: true,
        },
      },
      {
        label: '创建时间',
        prop: 'createdAt',
        valueType: 'date-picker',
        hideInSearch: true,
        hideInForm: true,
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
        hideInForm: true,
        width: 180,
        tableColumnProps: {
          align: 'center',
        },
      },
    ])

    // @ts-ignore
    const pageProps = computed<PlusPageProps>(() => {
      return {
        columns: unref(columns),
        search: {
          showNumber: 3,
        },
        table: {
          adaptive: true,
          defaultExpandAll: true,
          actionBar: {
            actionBarTableColumnProps: {
              align: 'center',
            },
            buttons: [
              {
                text: '编辑',
                code: 'update',
                props: { type: 'success' },
                onClick({ row }) {
                  updateHook.showUpdate(row)
                },
              },
              {
                text: '删除',
                code: 'delete',
                props: {
                  type: 'warning',
                },
                confirm: {
                  message: ({ row }) => `确定删除【${row.deptName}】吗？`,
                  options: {
                    type: 'warning',
                  },
                },
                onConfirm({ row }) {
                  systemDeptApi.remove({ ids: [row.id] })
                    .then(() => {
                      ElNotification.success({ title: '通知', message: '删除成功' })
                      pageInstance.value.getList()
                    })
                },
              },
            ],
          },
        },
        request: async ({ page, pageSize, ...rest }) => {
          const list = await systemDeptApi.findList(rest)
          const data = listToTree(list)

          return { data }
        },
        pagination: false,
        searchCardProps: {
          shadow: 'never',
        },
        tableCardProps: {
          shadow: 'never',
        },
      }
    })

    async function getDeptTree() {
      const list = await systemDeptApi.findList({})
      deptTree.value = listToTree(list)
    }

    const createHook = useCreate({ pageInstance, columns, getDeptTree })
    const updateHook = useUpdate({ pageInstance, columns, getDeptTree })

    return {
      pageInstance,
      pageProps,
      ...createHook,
      ...updateHook,
    }
  },
  render() {
    return (
      <div>
        <PlusPage ref="pageInstance" {...this.pageProps}>
          {{
            'table-title': () => (
              <ElSpace>
                <ElButton
                  type="primary"
                  icon={<Icon icon="ep:plus" />}
                  onClick={this.showCreate}
                >
                  添加
                </ElButton>
              </ElSpace>
            ),
          }}
        </PlusPage>
        {/* 新增 */}
        <PlusDialogForm
          v-model:visible={this.createVisible}
          v-model={this.createValues}
          dialog={this.createDialogProps}
          form={this.createFormProps}
          onConfirm={this.confirmCreate}
        />
        {/* 更新 */}
        <PlusDialogForm
          v-model:visible={this.updateVisible}
          v-model={this.updateValues}
          dialog={this.updateDialogProps}
          form={this.updateFormProps}
          onConfirm={this.confirmUpdate}
        />
      </div>
    )
  },
})
