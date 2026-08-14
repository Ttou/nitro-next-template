<script setup lang="ts">
import type { InputProps } from 'element-plus'
import type { VxeGridProps } from 'vxe-table'
import type { FindMonitorCachePageItemResDto } from '~web/apis/globals'
import { Icon } from '@iconify/vue'
import { ElButton, ElMessage, ElMessageBox, ElNotification, ElSpace } from 'element-plus'
import { h, reactive, useTemplateRef } from 'vue'
import { formatTime } from '~shared/utils'

const gridRef = useTemplateRef('gridRef')
const gridOptions = reactive<VxeGridProps<FindMonitorCachePageItemResDto>>({
  border: true,
  showHeader: true,
  showOverflow: true,
  height: 'auto',
  align: 'center',
  toolbarConfig: {
    custom: true,
    refresh: true,
    zoom: true,
    slots: {
      buttons: 'toolbar_buttons',
    },
  },
  formConfig: {
    items: [
      {
        title: '缓存键',
        field: 'key',
        span: 6,
        itemRender: {
          name: 'ElInput',
          props: {
            placeholder: '请输入',
          } as InputProps,
        },
      },
      {
        span: 6,
        collapseNode: true,
        slots: {
          default: () => h(
            ElSpace,
            {
              class: 'search-area-space',
            },
            () => [
              h(ElButton, { type: 'primary', nativeType: 'submit' }, () => '搜索'),
              h(ElButton, { nativeType: 'reset' }, () => '重置'),
            ],
          ),
        },
      },
    ],
  },
  columns: [
    {
      type: 'checkbox',
      fixed: 'left',
      width: 50,
    },
    {
      title: '序号',
      type: 'seq',
      fixed: 'left',
      width: 50,
    },
    {
      title: '缓存键',
      field: 'key',
      minWidth: 350,
    },
    {
      title: '过期时间',
      field: 'ttl',
      width: 200,
      formatter: ({ cellValue }) => formatTime(cellValue),
    },
    {
      title: '操作',
      width: 120,
      slots: {
        default: 'columns_operation',
      },
    },
  ],
  pagerConfig: {
    background: true,
    layouts: [
      'PrevJump',
      'PrevPage',
      'JumpNumber',
      'NextPage',
      'NextJump',
      'Sizes',
      'FullJump',
      'Total',
    ],
    pageSize: 20,
  },
  proxyConfig: {
    seq: true,
    form: true,
    response: {
      result: 'data',
      total: 'total',
    },
    ajax: {
      query: async ({ page, form }) => {
        const result = await Apis.MonitorCache.findPage({
          data: {
            ...form,
            page: page.currentPage,
            pageSize: page.pageSize,
          },
        })

        return result
      },
    },
  },
})

function handleRemove(keys: string[]) {
  Apis.MonitorCache.remove({ data: { keys } })
    .then(() => {
      ElNotification.success({ title: '通知', message: '删除成功' })
      gridRef.value?.commitProxy('query')
    })
}

function handleConfirmRemoveOne(row: FindMonitorCachePageItemResDto) {
  ElMessageBox.confirm(`确定删除【${row.key}】吗？`, {
    type: 'warning',
    title: '提示',
  })
    .then(() => {
      handleRemove([row.key])
    })
    .catch(() => {})
}

function handleConfirmRemoveMany() {
  const selectedIds = gridRef.value?.getCheckboxRecords().map(v => v.key)

  if (!selectedIds?.length) {
    ElMessage.warning('请选择要删除的数据')
    return
  }

  ElMessageBox.confirm('确定删除选中的数据吗？', {
    type: 'warning',
    title: '提示',
  })
    .then(() => {
      handleRemove(selectedIds)
    })
    .catch(() => {})
}

function handleConfirmRemoveAll() {
  ElMessageBox.confirm('确定清空缓存吗？', {
    type: 'warning',
    title: '提示',
  })
    .then(() => {
      Apis.MonitorCache.clear()
        .then(() => {
          ElNotification.success({ title: '通知', message: '清空成功' })
          gridRef.value?.commitProxy('query')
        })
    })
    .catch(() => {})
}
</script>

<template>
  <div class="auto-page">
    <vxe-grid ref="gridRef" v-bind="gridOptions">
      <template #toolbar_buttons>
        <ElSpace>
          <ElButton type="danger" @click="handleConfirmRemoveMany">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            批量删除
          </ElButton>
          <ElButton type="danger" @click="handleConfirmRemoveAll">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            清空缓存
          </ElButton>
        </ElSpace>
      </template>
      <template #columns_operation="{ row }">
        <ElSpace>
          <ElButton type="danger" link @click="handleConfirmRemoveOne(row)">
            删除
          </ElButton>
        </ElSpace>
      </template>
    </vxe-grid>
  </div>
</template>
