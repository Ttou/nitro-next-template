<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { PermissionEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { t } from '~web/i18n'
import { useDetail, useRemove } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('monitor.cache.field.cacheKey'),
    prop: 'key',
    minWidth: 350,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('monitor.cache.field.expireTime'),
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
    defaultPageInfo: {
      page: 1,
      pageSize: 20,
    },
    table: {
      adaptive: true,
      hasIndexColumn: true,
      isSelection: true,
      rowKey: 'key',
      indexTableColumnProps: {
        label: t('common.field.index'),
      },
      actionBar: {
        actionBarTableColumnProps: {
          align: 'center',
        },
        buttons: [
          {
            text: t('common.button.detail'),
            code: 'info',
            show: hasPermission(PermissionEnum.MONITOR_CACHE_FIND_BY_KEY),
            props: (row, index, button) => ({
              type: 'primary',
            }),
            onClick({ row }) {
              showDetail(row)
            },
          },
          {
            text: t('common.button.delete'),
            code: 'delete',
            show: hasPermission(PermissionEnum.MONITOR_CACHE_REMOVE),
            props: (row, index, button) => ({
              type: 'warning',
            }),
            confirm: {
              message: ({ row }) => t('common.confirm.deleteWithName', { name: row.key }),
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

const { detailVisible, detailValues, detailDialogProps, detailFormProps, showDetail, closeDetail } = useDetail({ pageInstance, columns })
const { confirmRemove, confirmClear } = useRemove({ pageInstance, selectedIds })
</script>

<template>
  <div class="auto-page">
    <plus-page ref="pageInstance" v-bind="pageProps">
      <template #table-title>
        <el-space>
          <el-button v-permission="PermissionEnum.MONITOR_CACHE_REMOVE" type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            {{ $t('common.button.batchDelete') }}
          </el-button>
          <el-button v-permission="PermissionEnum.MONITOR_CACHE_CLEAR" type="danger" @click="confirmClear">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            {{ $t('monitor.cache.button.clear') }}
          </el-button>
        </el-space>
      </template>
    </plus-page>
    <!-- 详情 -->
    <plus-dialog-form
      v-model:visible="detailVisible"
      v-model="detailValues"
      :dialog="detailDialogProps"
      :form="detailFormProps"
      @close="closeDetail"
    />
  </div>
</template>
