<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { YesOrNoEnum } from '~shared/enums'
import { systemRoleAuthApi } from '~web/apis'
import { useCreate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const route = useRoute()

const id = computed(() => route.query.id as string)

// @ts-ignore
const pageProps = computed<PlusPageProps>(() => {
  return {
    columns: [
      {
        label: '账号',
        prop: 'userName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '昵称',
        prop: 'nickName',
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '手机',
        prop: 'phone',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '邮箱',
        prop: 'email',
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: '是否可用',
        prop: 'isAvailable',
        valueType: 'select',
        options: YesOrNoEnum.items,
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
        width: 180,
        tableColumnProps: {
          align: 'center',
        },
      },
    ],
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
            text: '取消授权',
            code: 'cancel',
            props: { type: 'danger' },
            confirm: {
              message: ({ row }) => `确定取消授权【${row.userName}】吗？`,
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
      return await systemRoleAuthApi.findAllocatedUserPage({
        id: unref(id),
        ...params,
      })
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { createVisible, createDialogProps, createPageProps, showCreate, confirmCreate } = useCreate({ pageInstance, id })

function confirmRemove(ids: string[], batch: boolean = false) {
  const handler = () => systemRoleAuthApi.unallocateUser({
    id: unref(id),
    ids,
  })
    .then(() => {
      ElNotification.success({ title: '通知', message: '取消授权成功' })
      pageInstance.value.getList()
    })

  if (batch) {
    if (!selectedIds.value.length) {
      ElMessage.warning('请选择要取消授权的数据')
      return
    }

    ElMessageBox.confirm('确定取消授权选中的数据吗？', {
      type: 'warning',
      title: '提示',
    })
      .then(() => {
        handler()
      })
      .catch(() => {})
  }
  else {
    handler()
  }
}
</script>

<template>
  <div>
    <plus-page ref="pageInstance" v-bind="pageProps">
      <template #table-title>
        <el-space>
          <el-button type="primary" @click="showCreate">
            <template #icon>
              <Icon icon="ep:plus" />
            </template>
            添加
          </el-button>
          <el-button type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            批量取消授权
          </el-button>
        </el-space>
      </template>
    </plus-page>
    <!-- 新增 -->
    <plus-dialog
      v-model="createVisible"
      v-bind="createDialogProps"
      @confirm="confirmCreate"
    >
      <plus-page v-bind="createPageProps" />
    </plus-dialog>
  </div>
</template>
