<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'

import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { LangEnum, YesOrNoEnum } from '~shared/enums'
import { systemLangApi } from '~web/apis'
import { useCreate, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: '词条标识',
    prop: 'langKey',
    fieldProps: {
      disabled: unref(updateVisible),
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '系统内置',
    prop: 'isBuiltin',
    valueType: 'select',
    options: YesOrNoEnum.items,
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
    label: '简体中文',
    prop: 'langValue',
    hideInForm: true,
    hideInSearch: true,
    tableColumnProps: {
      align: 'center',
    },
    formatter(value, data) {
      return JSON.parse(value ?? '')[LangEnum.ZH_CN]
    },
  },
  {
    label: '备注',
    prop: 'remark',
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
              disabled: row.isBuiltin === YesOrNoEnum.YES,
            }),
            confirm: {
              message: ({ row }) => `确定删除【${row.configName}】吗？`,
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

      return await systemLangApi.findPage(_params)
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { createVisible, createValues, createDrawerProps, createFormProps, showCreate, confirmCreate } = useCreate({ pageInstance, columns })
const { updateVisible, updateValues, updateDrawerProps, updateFormProps, showUpdate, confirmUpdate } = useUpdate({ pageInstance, columns })
const { confirmRemove } = useRemove({ pageInstance, selectedIds })
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
        </el-space>
      </template>
    </plus-page>
    <!-- 新增 -->
    <plus-drawer-form
      v-model:visible="createVisible"
      v-model="createValues"
      v-bind="createDrawerProps"
      :form="createFormProps"
      @confirm="confirmCreate"
    />
    <!-- 更新 -->
    <plus-drawer-form
      v-model:visible="updateVisible"
      v-model="updateValues"
      v-bind="updateDrawerProps"
      :form="updateFormProps"
      @confirm="confirmUpdate"
    />
  </div>
</template>
