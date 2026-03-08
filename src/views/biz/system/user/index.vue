<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { computed, ref, unref, useTemplateRef } from 'vue'
import { YesOrNoEnum } from '~shared/enums'
import { systemUserApi } from '~web/apis'
import { useDict } from '~web/hooks/useDict'
import { dictToOptions } from '~web/utils'
import { useCreate, useExport, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])
const dict = useDict(['sys.user.sex'])

// @ts-ignore
const columns = computed<PlusColumn[]>(() => [
  {
    label: '账号',
    prop: 'userName',
    fieldProps: {
      disabled: unref(updateVisible),
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '密码',
    prop: 'password',
    fieldProps: {
      type: 'password',
    },
    hideInSearch: true,
    hideInTable: true,
    hideInForm: unref(updateVisible),
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
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '邮箱',
    prop: 'email',
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '性别',
    prop: 'sex',
    valueType: 'select',
    options: dictToOptions(dict.value.get('sys.user.sex')),
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '头像',
    prop: 'avatar',
    valueType: 'image',
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
    tableColumnProps: {
      align: 'center',
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

// @ts-ignore
const plusPageProps = computed<PlusPageProps>(() => {
  return {
    columns: unref(columns),
    search: {
      showNumber: 3,
    },
    table: {
      width: '100%',
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
              showUpdate(row)
            },
          },
          {
            text: '删除',
            code: 'delete',
            props: (row, index, button) => ({
              type: 'warning',
            }),
            confirm: {
              message: ({ row }) => `确定删除【${row.nickName}】吗？`,
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
      return await systemUserApi.findPage(params)
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { createVisible, createValues, createDialogProps, createFormProps, showCreate, confirmCreate } = useCreate({ pageInstance, columns })
const { updateVisible, updateValues, updateDialogProps, updateFormProps, showUpdate, confirmUpdate } = useUpdate({ pageInstance, columns })
const { confirmRemove } = useRemove({ pageInstance, selectedIds })
const { confirmExport } = useExport({ pageInstance, selectedIds })
</script>

<template>
  <div>
    <plus-page ref="pageInstance" v-bind="plusPageProps">
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
            批量删除
          </el-button>
          <el-button type="success" @click="confirmExport">
            <template #icon>
              <Icon icon="ep:download" />
            </template>
            导出
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
