<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { LangEnum, PermissionEnum, YesOrNoEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { t } from '~web/i18n'
import { useCreate, useImport, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('system.lang.field.langKey'),
    prop: 'langKey',
    fieldProps: {
      disabled: unref(updateVisible),
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('common.field.isBuiltin'),
    prop: 'isBuiltin',
    valueType: 'select',
    options: YesOrNoEnum.items,
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
    label: t('common.language.zhCN'),
    prop: 'langValue',
    hideInForm: true,
    hideInSearch: true,
    tableColumnProps: {
      align: 'center',
    },
    formatter(value, data) {
      return value[LangEnum.ZH_CN]
    },
  },
  {
    label: t('common.field.remark'),
    prop: 'remark',
    tableColumnProps: {
      align: 'center',
      showOverflowTooltip: true,
    },
  },
  {
    label: t('common.field.createdAt'),
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
    label: t('common.field.updatedAt'),
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
    defaultPageInfo: {
      page: 1,
      pageSize: 20,
    },
    table: {
      adaptive: true,
      hasIndexColumn: true,
      isSelection: true,
      indexTableColumnProps: {
        label: t('common.field.index'),
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
            text: t('common.button.edit'),
            code: 'update',
            show: hasPermission(PermissionEnum.SYSTEM_LANG_UPDATE),
            props: { type: 'success' },
            onClick({ row }) {
              showUpdate(row)
            },
          },
          {
            text: t('common.button.delete'),
            code: 'delete',
            show: hasPermission(PermissionEnum.SYSTEM_LANG_REMOVE),
            props: (row, index, button) => ({
              type: 'warning',
              disabled: row.isBuiltin === YesOrNoEnum.YES,
            }),
            confirm: {
              message: ({ row }) => t('common.confirm.deleteWithName', { name: row.configName }),
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

      Reflect.deleteProperty(_params, 'createdAt')

      return await Apis.SystemLang.findPage({ data: _params })
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { createVisible, createValues, createDrawerProps, createFormProps, showCreate, confirmCreate, cancelCreate } = useCreate({ pageInstance, columns })
const { updateVisible, updateValues, updateDrawerProps, updateFormProps, showUpdate, confirmUpdate, cancelUpdate } = useUpdate({ pageInstance, columns })
const { confirmRemove } = useRemove({ pageInstance, selectedIds })
const { importVisible, importValues, importDialogProps, importFormProps, importTemplateLoading, exportTemplateLoading, showImport, exportTemplate, httpRequest, beforeUpload } = useImport({ pageInstance })
</script>

<template>
  <div class="auto-page">
    <plus-page ref="pageInstance" v-bind="pageProps">
      <template #table-title>
        <el-space>
          <el-button v-permission="PermissionEnum.SYSTEM_LANG_CREATE" type="primary" @click="showCreate">
            <template #icon>
              <Icon icon="ep:plus" />
            </template>
            {{ $t('common.button.add') }}
          </el-button>
          <el-button v-permission="PermissionEnum.SYSTEM_LANG_REMOVE" type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            {{ $t('common.button.batchDelete') }}
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
    <plus-drawer-form
      v-model:visible="createVisible"
      v-model="createValues"
      v-bind="createDrawerProps"
      :form="createFormProps"
      @confirm="confirmCreate"
      @cancel="cancelCreate"
    />
    <!-- 更新 -->
    <plus-drawer-form
      v-model:visible="updateVisible"
      v-model="updateValues"
      v-bind="updateDrawerProps"
      :form="updateFormProps"
      @confirm="confirmUpdate"
      @cancel="cancelUpdate"
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
