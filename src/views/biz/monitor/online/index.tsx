import type { PlusColumn, PlusPageInstance } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { ElButton, ElSpace } from 'element-plus'

import { cloneDeep } from 'es-toolkit/compat'
import { PlusPage } from 'plus-pro-components'
import { computed, defineComponent, ref, unref } from 'vue'
import { YesOrNoEnum } from '~shared/enums'
import { useRemove } from './hooks'

export default defineComponent({
  setup() {
    const pageInstance = ref<PlusPageInstance>()
    const selectedIds = ref<string[]>([])

    const columns = computed<PlusColumn[]>(() => [
      {
        label: '会话编号',
        prop: 'tokenId',
        minWidth: 200,
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '登录名称',
        prop: 'user.userName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '登录昵称',
        prop: 'user.nickName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '主机',
        prop: 'ip',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '登录地点',
        prop: 'location',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '浏览器',
        prop: 'browser',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '操作系统',
        prop: 'os',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '登录时间',
        prop: 'loginTime',
        width: 200,
        valueType: 'date-picker',
        fieldProps: {
          type: 'datetimerange',
        },
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
          selectionTableColumnProps: {
            selectable(row, index) {
              return row.isBuiltin !== YesOrNoEnum.YES
            },
          },
          actionBar: {
            actionBarTableColumnProps: {
              align: 'center',
            },
            buttons: [
              {
                text: '下线',
                code: 'delete',
                props: (row, index, button) => ({
                  type: 'warning',
                  disabled: row.isBuiltin === YesOrNoEnum.YES,
                }),
                confirm: {
                  message: ({ row }) => `确定下线【${row.user.userName}】吗？`,
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

          if (_params.user?.userName) {
            Reflect.set(_params, 'userName', _params.user.userName)
          }

          if (_params.user?.nickName) {
            Reflect.set(_params, 'nickName', _params.user.nickName)
          }

          if (_params.loginTime) {
            Reflect.set(_params, 'beginTime', _params.loginTime[0])
            Reflect.set(_params, 'endTime', _params.loginTime[1])
          }

          return await monitorOnlineApi.findPage(_params)
        },
        searchCardProps: {
          shadow: 'never',
        },
        tableCardProps: {
          shadow: 'never',
        },
      }
    })

    const removeHook = useRemove({ pageInstance, selectedIds })

    return {
      pageInstance,
      pageProps,
      selectedIds,
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
                  type="danger"
                  icon={<Icon icon="ep:delete" />}
                  onClick={() => this.confirmRemove(this.selectedIds, true)}
                >
                  批量下线
                </ElButton>
              </ElSpace>
            ),
          }}
        </PlusPage>
      </div>
    )
  },
})
