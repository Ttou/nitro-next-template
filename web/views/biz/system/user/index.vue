<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { PermissionEnum, YesOrNoEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { useDict } from '~web/hooks/useDict'
import { t } from '~web/i18n'
import { dictToOptions } from '~web/utils'
import { useCreate, useExport, useImport, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])
const dict = useDict(['sys.user.sex'])

const route = useRoute()

const sexDictOptions = computed(() => dictToOptions(dict.value.get('sys.user.sex')))

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('common.field.account'),
    prop: 'userName',
    fieldProps: {
      disabled: unref(updateVisible),
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.password'),
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
    label: t('common.field.nickname'),
    prop: 'nickName',
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.phone'),
    prop: 'phone',
    tableColumnProps: {
      align: 'center',
    },
    minWidth: 120,
  },
  {
    label: t('common.field.email'),
    prop: 'email',
    tableColumnProps: {
      align: 'center',
    },
    minWidth: 180,
  },
  {
    label: t('common.field.gender'),
    prop: 'sex',
    valueType: 'select',
    options: sexDictOptions,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.avatar'),
    prop: 'avatar',
    valueType: 'image',
    hideInSearch: true,
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
    minWidth: 100,
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

const plusPageProps = computed<PlusPageProps>(() => {
  return {
    columns: unref(columns),
    search: {
      showNumber: 3,
      defaultValues: {
        userName: route.query.userName,
      },
    },
    defaultPageInfo: {
      page: 1,
      pageSize: 20,
    },
    table: {
      width: '100%',
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
            show: hasPermission(PermissionEnum.SYSTEM_USER_UPDATE),
            props: { type: 'success' },
            onClick({ row }) {
              showUpdate(row)
            },
          },
          {
            text: t('common.button.delete'),
            code: 'delete',
            show: hasPermission(PermissionEnum.SYSTEM_USER_REMOVE),
            props: (row, index, button) => ({
              type: 'warning',
              disabled: row.roles.some(item => item.roleKey.includes('sys.')),
            }),
            confirm: {
              message: ({ row }) => t('common.confirm.deleteWithName', { name: row.nickName }),
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
      return await Apis.SystemUser.findPage({ data: params })
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
const { importVisible, importValues, importDialogProps, importFormProps, importTemplateLoading, exportTemplateLoading, showImport, exportTemplate, httpRequest, beforeUpload } = useImport({ pageInstance })
</script>

<template>
  <div class="auto-page">
    <plus-page ref="pageInstance" v-bind="plusPageProps">
      <template #table-title>
        <el-space>
          <el-button v-permission="PermissionEnum.SYSTEM_USER_CREATE" type="primary" @click="showCreate">
            <template #icon>
              <Icon icon="ep:plus" />
            </template>
            {{ $t('common.button.add') }}
          </el-button>
          <el-button v-permission="PermissionEnum.SYSTEM_USER_REMOVE" type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            {{ $t('common.button.batchDelete') }}
          </el-button>
          <el-button v-permission="PermissionEnum.SYSTEM_USER_EXPORT" type="success" @click="confirmExport">
            <template #icon>
              <Icon icon="ep:download" />
            </template>
            {{ $t('common.button.export') }}
          </el-button>
          <el-button type="info" @click="showImport">
            <template #icon>
              <Icon icon="ep:upload" />
            </template>
            {{ $t('common.button.import') }}
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
    <!-- 导入 -->
    <plus-dialog-form
      v-model:visible="importVisible"
      v-model="importValues"
      :dialog="importDialogProps"
      :form="importFormProps"
    >
      <template #plus-field-template>
        <el-button type="primary" :loading="exportTemplateLoading" @click="exportTemplate">
          <template #icon>
            <Icon icon="ep:download" />
          </template>
          {{ $t('common.button.download') }}
        </el-button>
      </template>
      <template #plus-field-file>
        <el-upload
          v-loading="importTemplateLoading"
          :element-loading-text="$t('common.upload.uploading')"
          class="upload-wrap"
          drag
          :http-request="httpRequest"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <Icon class="upload-icon" icon="ep:upload-filled" />
          <div class="el-upload__text">
            {{ $t('common.upload.dragOrClick') }} <em>{{ $t('common.upload.clickToUpload') }}</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              {{ $t('common.upload.excelSizeLimit') }}
            </div>
          </template>
        </el-upload>
      </template>
    </plus-dialog-form>
  </div>
</template>

<style scoped>
.upload-wrap {
  width: 90%;
}

.upload-icon {
  margin-bottom: 16px;
  font-size: 67px;
  line-height: 50px;
  color: var(--el-text-color-placeholder);
}
</style>
