<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'

import { ElNotification } from 'element-plus'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { YesOrNoEnum } from '~shared/enums'
import { systemDeptApi } from '~web/apis'
import { listToTree } from '~web/utils'
import { useCreate, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const deptTree = ref<any[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: '上级部门',
    prop: 'parentId',
    valueType: 'tree-select',
    fieldProps: {
      data: unref(deptTree),
      nodeKey: 'id',
      props: {
        label: 'deptName',
        children: 'children',
      },
      checkStrictly: true,
      filterable: true,
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: '部门名称',
    prop: 'deptName',
  },
  {
    label: '部门标识',
    prop: 'deptKey',
    fieldProps: {
      disabled: unref(updateVisible),
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
    fieldProps: {
      type: 'textarea',
      rows: 3,
    },
    tableColumnProps: {
      align: 'center',
      showOverflowTooltip: true,
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

const pageProps = computed<PlusPageProps>(() => {
  return {
    columns: unref(columns),
    search: {
      showNumber: 3,
    },
    table: {
      adaptive: true,
      defaultExpandAll: true,
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
              showUpdate(row)
            },
          },
          {
            text: '删除',
            code: 'delete',
            props: {
              type: 'warning',
            },
            confirm: {
              message: ({ row }) => `确定删除【${row.deptName}】吗？`,
              options: {
                type: 'warning',
              },
            },
            onConfirm({ row }) {
              systemDeptApi.remove({ ids: [row.id] })
                .then(() => {
                  ElNotification.success({ title: '通知', message: '删除成功' })
                  pageInstance.value.getList()
                })
            },
          },
        ],
      },
    },
    request: async ({ page, pageSize, ...rest }) => {
      const list = await systemDeptApi.findList(rest)
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

async function getDeptTree() {
  const list = await systemDeptApi.findList({})
  deptTree.value = listToTree(list)
}

const { createVisible, createValues, createDialogProps, createFormProps, showCreate, confirmCreate } = useCreate({ pageInstance, columns, getDeptTree })
const { updateVisible, updateValues, updateDialogProps, updateFormProps, showUpdate, confirmUpdate } = useUpdate({ pageInstance, columns, getDeptTree })
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
        </el-space>
      </template>
    </plus-page>
    <!-- 新增 -->
    <plus-dialog-form
      v-model:visible="createVisible"
      v-model="createValues"
      :dialog="createDialogProps"
      :form="createFormProps"
      @confirm="confirmCreate"
    />
    <!-- 更新 -->
    <plus-dialog-form
      v-model:visible="updateVisible"
      v-model="updateValues"
      :dialog="updateDialogProps"
      :form="updateFormProps"
      @confirm="confirmUpdate"
    />
  </div>
</template>
