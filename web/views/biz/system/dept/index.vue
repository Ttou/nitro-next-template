<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { PermissionEnum, YesOrNoEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { t } from '~web/i18n'
import { listToTree } from '~web/utils'
import { useCreate, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const deptTree = ref<any[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('system.dept.field.parentDept'),
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
    label: t('system.dept.field.deptName'),
    prop: 'deptName',
  },
  {
    label: t('system.dept.field.deptKey'),
    prop: 'deptKey',
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
    defaultPageInfo: {
      page: 1,
      pageSize: 20,
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
            text: t('common.button.edit'),
            code: 'update',
            show: hasPermission(PermissionEnum.SYSTEM_DEPT_UPDATE),
            props: { type: 'success' },
            onClick({ row }) {
              showUpdate(row)
            },
          },
          {
            text: t('common.button.delete'),
            code: 'delete',
            show: hasPermission(PermissionEnum.SYSTEM_DEPT_REMOVE),
            props: {
              type: 'warning',
            },
            confirm: {
              message: ({ row }) => t('common.confirm.deleteWithName', { name: row.deptName }),
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
    },
    request: async ({ page, pageSize, ...rest }) => {
      const list = await Apis.SystemDept.findList({ data: rest })
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
  const list = await Apis.SystemDept.findList({ data: { } })
  deptTree.value = listToTree(list)
}

const { createVisible, createValues, createDialogProps, createFormProps, showCreate, confirmCreate } = useCreate({ pageInstance, columns, getDeptTree })
const { updateVisible, updateValues, updateDialogProps, updateFormProps, showUpdate, confirmUpdate } = useUpdate({ pageInstance, columns, getDeptTree })
const { confirmRemove } = useRemove({ pageInstance })
</script>

<template>
  <div class="auto-page">
    <plus-page ref="pageInstance" v-bind="pageProps">
      <template #table-title>
        <el-space>
          <el-button v-permission="PermissionEnum.SYSTEM_DEPT_CREATE" type="primary" @click="showCreate">
            <template #icon>
              <Icon icon="ep:plus" />
            </template>
            {{ $t('common.button.add') }}
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
