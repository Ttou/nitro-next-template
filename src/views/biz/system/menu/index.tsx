import type { PlusColumn, PlusPageInstance } from 'plus-pro-components'
import { Icon } from '@iconify/vue'

import { ElButton, ElSpace } from 'element-plus'
import { PlusDialogForm, PlusPage } from 'plus-pro-components'
import { computed, defineComponent, h, ref, unref } from 'vue'
import { MenuTypeEnum, YesOrNoEnum } from '~shared/enums'
import { systemMenuApi } from '~web/apis'
import { listToTree } from '~web/utils'
import { useCreate, useRemove, useUpdate } from './hooks'

export default defineComponent({
  setup() {
    const pageInstance = ref<PlusPageInstance>()
    const selectedIds = ref<string[]>([])
    const tree = ref([])

    const columns = computed<PlusColumn[]>(() => [
      {
        label: '上级菜单',
        prop: 'parentId',
        valueType: 'tree-select',
        fieldProps: {
          data: unref(tree),
          nodeKey: 'id',
          props: {
            label: 'menuName',
            children: 'children',
          },
          checkStrictly: true,
          filterable: true,
        },
        hideInSearch: true,
        hideInTable: true,
      },
      {
        label: '菜单名称',
        prop: 'menuName',
        minWidth: 200,
      },
      {
        label: '菜单标识',
        prop: 'menuKey',
        minWidth: 300,
        fieldProps: {
          disabled: unref(updateHook.updateVisible),
        },
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '菜单类型',
        prop: 'menuType',
        minWidth: 100,
        valueType: 'select',
        options: MenuTypeEnum.items,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '排序',
        prop: 'orderNum',
        hideInSearch: true,
        valueType: 'input-number',
        fieldProps: {
          min: 1,
        },
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '路由地址',
        prop: 'path',
        minWidth: 150,
        hideInForm: unref(updateHook.updateVisible)
          ? updateHook.updateValues.value.menuType === MenuTypeEnum.BUTTON
          : createHook.createValues.value.menuType === MenuTypeEnum.BUTTON,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '组件路径',
        prop: 'component',
        minWidth: 150,
        hideInForm: unref(updateHook.updateVisible)
          ? updateHook.updateValues.value.menuType === MenuTypeEnum.BUTTON
          : createHook.createValues.value.menuType === MenuTypeEnum.BUTTON,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '跳转地址',
        prop: 'redirect',
        minWidth: 150,
        hideInForm: unref(updateHook.updateVisible)
          ? updateHook.updateValues.value.menuType === MenuTypeEnum.BUTTON
          : createHook.createValues.value.menuType === MenuTypeEnum.BUTTON,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '图标',
        prop: 'icon',
        hideInSearch: true,
        hideInForm: unref(updateHook.updateVisible)
          ? updateHook.updateValues.value.menuType === MenuTypeEnum.BUTTON
          : createHook.createValues.value.menuType === MenuTypeEnum.BUTTON,
        render(value, data) {
          return value ? h(Icon, { icon: value }) : null
        },
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '是否可用',
        prop: 'isAvailable',
        minWidth: 100,
        valueType: 'select',
        options: YesOrNoEnum.items,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '是否缓存',
        prop: 'isCache',
        minWidth: 100,
        valueType: 'select',
        options: YesOrNoEnum.items,
        hideInSearch: true,
        hideInForm: unref(updateHook.updateVisible)
          ? [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(updateHook.updateValues.value.menuType)
          : [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(createHook.createValues.value.menuType),
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '是否外链',
        prop: 'isFrame',
        minWidth: 100,
        valueType: 'select',
        options: YesOrNoEnum.items,
        hideInSearch: true,
        hideInForm: unref(updateHook.updateVisible)
          ? [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(updateHook.updateValues.value.menuType)
          : [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(createHook.createValues.value.menuType),
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '是否可见',
        prop: 'isVisible',
        minWidth: 100,
        valueType: 'select',
        options: YesOrNoEnum.items,
        hideInSearch: true,
        hideInForm: unref(updateHook.updateVisible)
          ? updateHook.updateValues.value.menuType === MenuTypeEnum.BUTTON
          : createHook.createValues.value.menuType === MenuTypeEnum.BUTTON,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '备注',
        prop: 'remark',
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
                  message: ({ row }) => `确定删除【${row.dictLabel}】吗？`,
                  options: {
                    type: 'warning',
                  },
                },
                onConfirm({ row }) {
                  removeHook.confirmRemove([row.id])
                },
              },
            ],
          },
          onSelectionChange: (data: any[]) => {
            selectedIds.value = [...data].map(item => item.id)
          },
        },
        request: async ({ ...rest }) => {
          const list = await systemMenuApi.findList(rest)
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

    async function getTree() {
      const list = await systemMenuApi.findList({})
      tree.value = listToTree(list)
    }

    const createHook = useCreate({ pageInstance, columns, getTree })
    const updateHook = useUpdate({ pageInstance, columns, getTree })
    const removeHook = useRemove({ pageInstance, selectedIds })

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
