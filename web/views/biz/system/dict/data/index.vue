<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { PermissionEnum, YesOrNoEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { t } from '~web/i18n'
import { useCreate, useExport, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const route = useRoute()

const dictType = computed(() => route.query.dictType as string)

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('system.dictData.field.dictLabel'),
    prop: 'dictLabel',
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.dictData.field.dictValue'),
    prop: 'dictValue',
    fieldProps: {
      disabled: unref(updateVisible),
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.isAvailable'),
    prop: 'isAvailable',
    valueType: 'select',
    options: YesOrNoEnum.items,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.remark'),
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
    label: t('common.field.createdAt'),
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
    label: t('common.field.updatedAt'),
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
        label: t('common.field.index'),
      },
      actionBar: {
        actionBarTableColumnProps: {
          align: 'center',
        },
        buttons: [
          {
            text: t('common.button.edit'),
            code: 'update',
            show: hasPermission(PermissionEnum.SYSTEM_DICT_DATA_UPDATE),
            props: { type: 'success' },
            onClick({ row }) {
              showUpdate(row)
            },
          },
          {
            text: t('common.button.delete'),
            code: 'delete',
            show: hasPermission(PermissionEnum.SYSTEM_DICT_DATA_REMOVE),
            props: {
              type: 'warning',
            },
            confirm: {
              message: ({ row }) => t('common.confirm.deleteWithName', { name: row.dictLabel }),
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

      const data = await Apis.SystemDictData.findList({ data: _params })

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
          <el-button v-permission="PermissionEnum.SYSTEM_DICT_DATA_CREATE" type="primary" @click="showCreate">
            <template #icon>
              <Icon icon="ep:plus" />
            </template>
            {{ $t('common.button.add') }}
          </el-button>
          <el-button v-permission="PermissionEnum.SYSTEM_DICT_DATA_REMOVE" type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            {{ $t('common.button.batchDelete') }}
          </el-button>
          <el-button v-permission="PermissionEnum.SYSTEM_DICT_DATA_EXPORT" type="success" @click="confirmExport">
            <template #icon>
              <Icon icon="ep:download" />
            </template>
            {{ $t('common.button.export') }}
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
