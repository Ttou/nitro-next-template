<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { PermissionEnum, YesOrNoEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { t } from '~web/i18n'
import { useRemove } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('monitor.online.field.loginName'),
    prop: 'userName',
    minWidth: 120,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('monitor.online.field.loginNickname'),
    prop: 'nickName',
    minWidth: 120,
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
      indexTableColumnProps: {
        label: t('common.field.index'),
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
            text: t('monitor.online.button.offline'),
            code: 'delete',
            show: hasPermission(PermissionEnum.MONITOR_ONLINE_REMOVE),
            props: (row, index, button) => ({
              type: 'warning',
              disabled: row.isBuiltin === YesOrNoEnum.YES,
            }),
            confirm: {
              message: ({ row }) => t('monitor.online.confirm.offlineWithName', { name: row.userName }),
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
          <el-button v-permission="PermissionEnum.MONITOR_ONLINE_REMOVE" type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            {{ $t('monitor.online.button.batchOffline') }}
          </el-button>
        </el-space>
      </template>
    </plus-page>
  </div>
</template>
