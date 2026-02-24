import type { PlusColumn, PlusPageInstance } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { ElButton, ElLink, ElSpace } from 'element-plus'

import { cloneDeep } from 'es-toolkit/compat'
import { PlusDialogForm, PlusPage } from 'plus-pro-components'
import { computed, defineComponent, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { YesOrNoEnum } from '~shared/enums'
import { systemDictTypeApi } from '~web/apis'
import { useCreate, useRemove, useUpdate } from './hooks'

export default defineComponent({
  setup() {
    const pageInstance = ref<PlusPageInstance>()
    const selectedIds = ref<string[]>([])

    const router = useRouter()

    const columns = computed<PlusColumn[]>(() => [
      {
        label: '字典名称',
        prop: 'dictName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '字典类型',
        prop: 'dictType',
        valueType: 'link',
        fieldProps: {
          disabled: unref(updateHook.updateVisible),
        },
        render(value, data) {
          return (
            <ElLink
              type="primary"
              onClick={() => router.push({ path: '/system/dict/data', query: { dictType: value } })}
            >
              {value}
            </ElLink>
          )
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
        tableColumnProps: {
          align: 'center',
          showOverflowTooltip: true,
        },
      },
      {
        label: '创建时间',
        prop: 'createdAt',
        valueType: 'date-picker',
        fieldProps: {
          type: 'datetimerange',
        },
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
                  message: ({ row }) => `确定删除【${row.dictName}】吗？`,
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
        request: async (params) => {
          const _params = cloneDeep(params)

          if (_params.createdAt) {
            Reflect.set(_params, 'beginTime', _params.createdAt[0])
            Reflect.set(_params, 'endTime', _params.createdAt[1])
          }

          return await systemDictTypeApi.findPage(_params)
        },
        searchCardProps: {
          shadow: 'never',
        },
        tableCardProps: {
          shadow: 'never',
        },
      }
    })

    const createHook = useCreate({ pageInstance, columns })
    const updateHook = useUpdate({ pageInstance, columns })
    const removeHook = useRemove({ pageInstance, selectedIds })

    return {
      pageInstance,
      pageProps,
      selectedIds,
      ...createHook,
      ...updateHook,
      ...removeHook,
    }
  },
  render() {
    return (
      <div>
        <PlusPage
          ref="pageInstance"
          {...this.pageProps}
        >
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
                <ElButton
                  type="danger"
                  icon={<Icon icon="ep:delete" />}
                  onClick={() => this.confirmRemove(this.selectedIds, true)}
                >
                  批量删除
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
