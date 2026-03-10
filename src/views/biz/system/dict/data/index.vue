<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'

import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { YesOrNoEnum } from '~shared/enums'
import { systemDictDataApi } from '~web/apis'
import { useCreate, useExport, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const route = useRoute()

const dictType = computed(() => route.query.dictType as string)

const columns = computed<PlusColumn[]>(() => [
  {
    label: '字典标签',
    prop: 'dictLabel',
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '字典值',
    prop: 'dictValue',
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
              message: ({ row }) => `确定删除【${row.dictLabel}】吗？`,
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
    request: async ({ page, pageSize, ...params }) => {
      const _params = cloneDeep(params)

      Reflect.set(_params, 'dictType', unref(dictType))

      const data = await systemDictDataApi.findList(_params)

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

const { createVisible, createValues, createDialogProps, createFormProps, showCreate, confirmCreate } = useCreate({ pageInstance, dictType, columns })
const { updateVisible, updateValues, updateDialogProps, updateFormProps, showUpdate, confirmUpdate } = useUpdate({ pageInstance, dictType, columns })
const { confirmRemove } = useRemove({ pageInstance, selectedIds })
const { confirmExport } = useExport({ pageInstance, selectedIds, dictType })
</script>

<template>
  <div class="auto-page">
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
