<script setup lang="ts">
import type { InputProps } from 'element-plus'
import type { VxeGridProps } from 'vxe-table'
import type { FindMonitorOnlinePageResDto } from '~web/apis/globals'
import { Icon } from '@iconify/vue'
import { ElButton, ElMessage, ElMessageBox, ElNotification, ElSpace } from 'element-plus'
import { h, reactive, useTemplateRef } from 'vue'

const gridRef = useTemplateRef('gridRef')
const gridOptions = reactive<VxeGridProps>({
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
        title: '登录名称',
        field: 'userName',
        span: 6,
        itemRender: {
          name: 'ElInput',
          props: {
            placeholder: '请输入',
          } as InputProps,
        },
      },
      {
        title: '登录昵称',
        field: 'nickName',
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
      title: '登录名称',
      field: 'userName',
      minWidth: 120,
    },
    {
      title: '登录昵称',
      field: 'nickName',
      minWidth: 120,
    },
    {
      title: '操作',
      fixed: 'right',
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
        const result = await Apis.MonitorOnline.findPage({
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

function handleRemove(ids: string[]) {
  Apis.MonitorOnline.remove({ data: { ids } })
    .then(() => {
      ElNotification.success({ title: '通知', message: '删除成功' })
      gridRef.value?.commitProxy('query')
    })
}

function handleConfirmRemoveOne(row: FindMonitorOnlinePageResDto) {
  ElMessageBox.confirm(`确定下线【${row.userName}】吗？`, {
    type: 'warning',
    title: '提示',
  })
    .then(() => {
      handleRemove([row.id])
    })
    .catch(() => {})
}

function handleConfirmRemoveMany() {
  const selectedIds = gridRef.value?.getCheckboxRecords().map(v => v.id)

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
            批量下线
          </ElButton>
        </ElSpace>
      </template>
      <template #columns_operation="{ row }">
        <ElSpace>
          <ElButton type="danger" link @click="handleConfirmRemoveOne(row)">
            下线
          </ElButton>
        </ElSpace>
      </template>
    </vxe-grid>
  </div>
</template>
