<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { YesOrNoEnum } from '~shared/enums'
import { useRemove } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: '会话编号',
    prop: 'tokenId',
    minWidth: 350,
    hideInSearch: true,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '登录名称',
    prop: 'user.userName',
    minWidth: 120,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '登录昵称',
    prop: 'user.nickName',
    minWidth: 120,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '登录IP',
    prop: 'ip',
    minWidth: 120,
    hideInSearch: true,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '登录地点',
    prop: 'location',
    minWidth: 120,
    hideInSearch: true,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '浏览器',
    prop: 'userAgent.browserName',
    minWidth: 120,
    hideInSearch: true,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '操作系统',
    prop: 'userAgent.osName',
    minWidth: 120,
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
              confirmRemove([row.id])
            },
          },
        ],
      },
      onSelectionChange: (data: any[]) => {
        selectedIds.value = Array.from(data, item => item.id)
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

      return await Apis.MonitorOnline.findPage({ data: _params })
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { confirmRemove } = useRemove({ pageInstance, selectedIds })
</script>

<template>
  <div class="auto-page">
    <plus-page ref="pageInstance" v-bind="pageProps">
      <template #table-title>
        <el-space>
          <el-button type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            批量下线
          </el-button>
        </el-space>
      </template>
    </plus-page>
  </div>
</template>
