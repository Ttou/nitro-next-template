<script setup lang="ts">
import type { PlusColumn } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { ElLink } from 'element-plus'

import { cloneDeep } from 'es-toolkit/compat'
import { computed, h, ref, unref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { YesOrNoEnum } from '~shared/enums'
import { systemDictTypeApi } from '~web/apis'
import { useCreate, useExport, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const router = useRouter()

const columns = computed<PlusColumn[]>(() => [
  {
    label: '字典名称',
    prop: 'dictName',
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '字典类型',
    prop: 'dictType',
    valueType: 'link',
    fieldProps: {
      disabled: unref(updateVisible),
    },
    render(value, data) {
      return h(ElLink, { type: 'primary', onClick: () => router.push({ path: '/system/dict/data', query: { dictType: value } }) }, () => value)
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
    tableColumnProps: {
      align: 'center',
      showOverflowTooltip: true,
    },
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    valueType: 'date-picker',
    fieldProps: {
      type: 'datetimerange',
    },
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
              message: ({ row }) => `确定删除【${row.dictName}】吗？`,
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

      if (_params.createdAt) {
        Reflect.set(_params, 'beginTime', _params.createdAt[0])
        Reflect.set(_params, 'endTime', _params.createdAt[1])
      }

      return await systemDictTypeApi.findPage(_params)
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
