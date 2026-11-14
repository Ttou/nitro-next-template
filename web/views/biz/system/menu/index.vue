<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { computed, h, ref, unref, useTemplateRef } from 'vue'
import { MenuTypeEnum, PermissionEnum, YesOrNoEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { t } from '~web/i18n'
import { listToTree } from '~web/utils'
import { useCreate, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])
const tree = ref([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('system.menu.field.parentMenu'),
    prop: 'parentId',
    valueType: 'tree-select',
    fieldProps: {
      data: unref(tree),
      nodeKey: 'id',
      props: {
        label: 'menuName',
        children: 'children',
      },
      checkStrictly: true,
      filterable: true,
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: t('system.menu.field.menuName'),
    prop: 'menuName',
    minWidth: 200,
  },
  {
    label: t('system.menu.field.menuKey'),
    prop: 'menuKey',
    minWidth: 300,
    fieldProps: {
      disabled: unref(updateVisible),
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.menuType'),
    prop: 'menuType',
    minWidth: 100,
    valueType: 'select',
    options: MenuTypeEnum.items,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.sort'),
    prop: 'orderNum',
    hideInSearch: true,
    valueType: 'input-number',
    fieldProps: {
      min: 1,
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.routePath'),
    prop: 'path',
    minWidth: 150,
    hideInForm: unref(updateVisible)
      ? updateValues.value.menuType === MenuTypeEnum.BUTTON
      : createValues.value.menuType === MenuTypeEnum.BUTTON,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.componentPath'),
    prop: 'component',
    minWidth: 150,
    hideInForm: unref(updateVisible)
      ? updateValues.value.menuType === MenuTypeEnum.BUTTON
      : createValues.value.menuType === MenuTypeEnum.BUTTON,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.redirectPath'),
    prop: 'redirect',
    minWidth: 150,
    hideInForm: unref(updateVisible)
      ? updateValues.value.menuType === MenuTypeEnum.BUTTON
      : createValues.value.menuType === MenuTypeEnum.BUTTON,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.icon'),
    prop: 'icon',
    hideInSearch: true,
    hideInForm: unref(updateVisible)
      ? updateValues.value.menuType === MenuTypeEnum.BUTTON
      : createValues.value.menuType === MenuTypeEnum.BUTTON,
    render(value, data) {
      return value
        ? h(Icon, { icon: value })
        : null
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.isAvailable'),
    prop: 'isAvailable',
    minWidth: 100,
    valueType: 'select',
    options: YesOrNoEnum.items,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.isCache'),
    prop: 'isCache',
    minWidth: 100,
    valueType: 'select',
    options: YesOrNoEnum.items,
    hideInSearch: true,
    hideInForm: unref(updateVisible)
      ? [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(updateValues.value.menuType)
      : [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(createValues.value.menuType),
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.isExternal'),
    prop: 'isFrame',
    minWidth: 100,
    valueType: 'select',
    options: YesOrNoEnum.items,
    hideInSearch: true,
    hideInForm: unref(updateVisible)
      ? [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(updateValues.value.menuType)
      : [MenuTypeEnum.FOLDER, MenuTypeEnum.BUTTON].includes(createValues.value.menuType),
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('system.menu.field.isVisible'),
    prop: 'isVisible',
    minWidth: 100,
    valueType: 'select',
    options: YesOrNoEnum.items,
    hideInSearch: true,
    hideInForm: unref(updateVisible)
      ? updateValues.value.menuType === MenuTypeEnum.BUTTON
      : createValues.value.menuType === MenuTypeEnum.BUTTON,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.remark'),
    prop: 'remark',
    hideInSearch: true,
    tableColumnProps: {
      align: 'center',
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
      actionBar: {
        actionBarTableColumnProps: {
          align: 'center',
        },
        buttons: [
          {
            text: t('common.button.edit'),
            code: 'update',
            show: hasPermission(PermissionEnum.SYSTEM_MENU_UPDATE),
            props: { type: 'success' },
            onClick({ row }) {
              showUpdate(row)
            },
          },
          {
            text: t('common.button.delete'),
            code: 'delete',
            show: hasPermission(PermissionEnum.SYSTEM_MENU_REMOVE),
            props: (row, index, button) => {
              return {
                type: 'warning',
                disabled: row.menuKey.includes('sys.'),
              }
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
    request: async ({ ...rest }) => {
      const list = await Apis.SystemMenu.findList({ data: rest })
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

async function getTree() {
  const list = await Apis.SystemMenu.findList({ data: {} })
  tree.value = listToTree(list)
}

const { createVisible, createValues, createDialogProps, createFormProps, showCreate, confirmCreate } = useCreate({ pageInstance, columns, getTree })
const { updateVisible, updateValues, updateDialogProps, updateFormProps, showUpdate, confirmUpdate } = useUpdate({ pageInstance, columns, getTree })
const { confirmRemove } = useRemove({ pageInstance, selectedIds })
</script>

<template>
  <div class="auto-page">
    <plus-page ref="pageInstance" v-bind="pageProps">
      <template #table-title>
        <el-space>
          <el-button v-permission="PermissionEnum.SYSTEM_MENU_CREATE" type="primary" @click="showCreate">
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
