<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { useRemove } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: '缓存键',
    prop: 'key',
    minWidth: 350,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '过期时间',
    prop: 'ttl',
    width: 200,
    valueType: 'date-picker',
    fieldProps: {
      type: 'datetimerange',
    },
    hideInSearch: true,
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
      rowKey: 'key',
      indexTableColumnProps: {
        label: '序号',
      },
      actionBar: {
        actionBarTableColumnProps: {
          align: 'center',
        },
        buttons: [
          {
            text: '删除',
            code: 'delete',
            props: (row, index, button) => ({
              type: 'warning',
            }),
            confirm: {
              message: ({ row }) => `确定删除【${row.key}】吗？`,
              options: {
                type: 'warning',
              },
            },
            onConfirm({ row }) {
              confirmRemove([row.key])
            },
          },
        ],
      },
      onSelectionChange: (data: any[]) => {
        selectedIds.value = Array.from(data, item => item.key)
      },
    },
    request: async (params) => {
      const _params = cloneDeep(params)

      return await Apis.MonitorCache.findPage({ data: _params })
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { confirmRemove, confirmClear } = useRemove({ pageInstance, selectedIds })
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
            批量删除
          </el-button>
          <el-button type="danger" @click="confirmClear">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            清空缓存
          </el-button>
        </el-space>
      </template>
    </plus-page>
  </div>
</template>
