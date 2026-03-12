<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { ElText } from 'element-plus'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, h, unref, useTemplateRef } from 'vue'
import { monitorOperateApi } from '~web/apis'
import { useDetail } from './hooks'

const pageInstance = useTemplateRef('pageInstance')

const columns = computed<PlusColumn[]>(() => [
  {
    label: '请求链接',
    prop: 'requestUrl',
    minWidth: 300,
    valueType: 'text',
    fieldProps: {
      type: 'info',
    },
    tableColumnProps: {
      align: 'center',
    },
    hideInSearch: true,
  },
  {
    label: '请求方法',
    prop: 'requestMethod',
    minWidth: 100,
    valueType: 'text',
    fieldProps: {
      type: 'info',
    },
    tableColumnProps: {
      align: 'center',
    },
    hideInSearch: true,
  },
  {
    label: '请求IP',
    prop: 'ip',
    minWidth: 100,
    valueType: 'text',
    fieldProps: {
      type: 'info',
    },
    tableColumnProps: {
      align: 'center',
    },
    hideInSearch: true,
  },
  {
    label: '请求地点',
    prop: 'location',
    minWidth: 120,
    valueType: 'text',
    fieldProps: {
      type: 'info',
    },
    tableColumnProps: {
      align: 'center',
    },
    hideInSearch: true,
  },
  {
    label: '请求状态',
    prop: 'status',
    minWidth: 100,
    valueType: 'text',
    fieldProps: value => ({
      type: value === 200 ? 'success' : 'danger',
    }),
    tableColumnProps: {
      align: 'center',
    },
    hideInSearch: true,
  },
  {
    label: '控制器名称',
    prop: 'controllerName',
    valueType: 'text',
    fieldProps: {
      type: 'info',
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: '处理器名称',
    prop: 'handlerName',
    valueType: 'text',
    fieldProps: {
      type: 'info',
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: '操作人账号',
    prop: 'user.userName',
    minWidth: 150,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '操作人昵称',
    prop: 'user.nickName',
    minWidth: 150,
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '耗时',
    prop: 'costTime',
    renderField(value, onChange, props) {
      return h(ElText, { type: 'warning' }, { default: () => `${value} ms` })
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: '操作时间',
    prop: 'operateTime',
    width: 200,
    valueType: 'date-picker',
    fieldProps: {
      type: 'datetimerange',
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: '请求参数',
    prop: 'requestParams',
    valueType: 'textarea',
    fieldProps: {
      rows: 4,
      readonly: true,
      placeholder: '无',
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: '请求结果',
    prop: 'requestResult',
    valueType: 'textarea',
    fieldProps: {
      rows: 4,
      readonly: true,
      placeholder: '无',
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: '错误信息',
    prop: 'errorMsg',
    valueType: 'textarea',
    fieldProps: {
      rows: 4,
      readonly: true,
      placeholder: '无',
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: '用户代理',
    prop: 'userAgent',
    valueType: 'textarea',
    fieldProps: value => ({
      rows: 4,
      readonly: true,
      placeholder: '无',
      value: JSON.stringify(value),
    }),
    hideInSearch: true,
    hideInTable: true,
  },
])

const pageProps = computed<PlusPageProps>(() => {
  return {
    columns: unref(columns),
    search: {
      showNumber: 3,
      labelWidth: 100,
    },
    table: {
      adaptive: true,
      hasIndexColumn: true,
      isSelection: false,
      indexTableColumnProps: {
        label: '序号',
      },
      actionBar: {
        actionBarTableColumnProps: {
          align: 'center',
        },
        buttons: [
          {
            text: '详情',
            code: 'info',
            props: (row, index, button) => ({
              type: 'primary',
            }),
            onClick({ row }) {
              showDetail(row)
            },
          },
        ],
      },
    },
    request: async (params) => {
      const _params = cloneDeep(params)

      if (_params.user?.userName) {
        Reflect.set(_params, 'userName', _params.user.userName)
      }

      if (_params.user?.nickName) {
        Reflect.set(_params, 'nickName', _params.user.nickName)
      }

      if (_params.operateTime) {
        Reflect.set(_params, 'beginTime', _params.operateTime[0])
        Reflect.set(_params, 'endTime', _params.operateTime[1])
      }

      return await monitorOperateApi.findPage(_params)
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { detailVisible, detailValues, detailDialogProps, detailFormProps, showDetail, closeDetail } = useDetail({ pageInstance, columns })
</script>

<template>
  <div class="auto-page">
    <plus-page ref="pageInstance" v-bind="pageProps" />
    <!-- 详情 -->
    <plus-dialog-form
      v-model:visible="detailVisible"
      v-model="detailValues"
      :dialog="detailDialogProps"
      :form="detailFormProps"
      @close="closeDetail"
    />
  </div>
</template>
