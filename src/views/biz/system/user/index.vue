<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { YesOrNoEnum } from '~shared/enums'
import { systemUserApi } from '~web/apis'
import { useDict } from '~web/hooks/useDict'
import { dictToOptions } from '~web/utils'
import { useCreate, useExport, useImport, useRemove, useUpdate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])
const dict = useDict(['sys.user.sex'])

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
const { importVisible, importValues, importDialogProps, importFormProps, importTemplateLoading, exportTemplateLoading, showImport, exportTemplate, httpRequest, beforeUpload } = useImport({ pageInstance })
</script>

<template>
  <div class="auto-page">
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
          <el-button type="info" @click="showImport">
            <template #icon>
              <Icon icon="ep:upload" />
            </template>
            导入
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
          下载
        </el-button>
      </template>
      <template #plus-field-file>
        <el-upload
          v-loading="importTemplateLoading"
          element-loading-text="上传中..."
          class="upload-wrap"
          drag
          :http-request="httpRequest"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <Icon class="upload-icon" icon="ep:upload-filled" />
          <div class="el-upload__text">
            拖放文件或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              Excel 文件大小不能超过 10mb
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
