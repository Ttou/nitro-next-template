<script setup lang="ts">
import type { PlusColumn, PlusPageProps } from 'plus-pro-components'
import { ElLink, ElText } from 'element-plus'
import { cloneDeep } from 'es-toolkit/compat'
import { computed, h, unref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '~web/i18n'
import { useDetail } from './hooks'

const pageInstance = useTemplateRef('pageInstance')

const router = useRouter()

const columns = computed<PlusColumn[]>(() => [
  {
    label: t('monitor.loginLog.field.requestIp'),
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
    label: t('monitor.loginLog.field.requestLocation'),
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
    label: t('monitor.loginLog.field.requestStatus'),
    prop: 'status',
    minWidth: 100,
    valueType: 'tag',
    fieldProps: value => ({
      type: value === 200
        ? 'success'
        : 'danger',
    }),
    tableColumnProps: {
      align: 'center',
    },
    hideInSearch: true,
  },
  {
    label: t('monitor.loginLog.field.loginAccount'),
    prop: 'userName',
    minWidth: 150,
    render(value, data) {
      return h(
        ElLink,
        {
          type: 'primary',
          onClick: () => router.push({
            path: '/system/user',
            query: { userName: value },
          }),
        },
        () => value,
      )
    },
    tableColumnProps: {
      align: 'center',
    },
  },
  {
    label: t('monitor.loginLog.field.costTime'),
    prop: 'costTime',
    renderField(value, onChange, props) {
      return h(
        ElText,
        { type: 'warning' },
        {
          default: () => `${value} ms`,
        },
      )
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: t('monitor.loginLog.field.operateTime'),
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
    label: t('monitor.loginLog.field.loginToken'),
    prop: 'token',
    valueType: 'textarea',
    fieldProps: {
      rows: 4,
      readonly: true,
      placeholder: t('common.placeholder.none'),
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: t('monitor.loginLog.field.errorMessage'),
    prop: 'errorMsg',
    valueType: 'textarea',
    fieldProps: {
      rows: 4,
      readonly: true,
      placeholder: t('common.placeholder.none'),
    },
    hideInSearch: true,
    hideInTable: true,
  },
  {
    label: t('monitor.loginLog.field.userAgent'),
    prop: 'userAgent',
    valueType: 'textarea',
    fieldProps: value => ({
      rows: 4,
      readonly: true,
      placeholder: t('common.placeholder.none'),
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
    defaultPageInfo: {
      page: 1,
      pageSize: 20,
    },
    table: {
      adaptive: true,
      hasIndexColumn: true,
      isSelection: false,
      indexTableColumnProps: {
        label: t('common.field.index'),
      },
      actionBar: {
        actionBarTableColumnProps: {
          align: 'center',
        },
        buttons: [
          {
            text: t('common.button.detail'),
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

      if (_params?.operateTime) {
        Reflect.set(_params, 'beginTime', _params.operateTime[0])
        Reflect.set(_params, 'endTime', _params.operateTime[1])
      }

      Reflect.deleteProperty(_params, 'user')
      Reflect.deleteProperty(_params, 'operateTime')

      return await Apis.MonitorLoginLog.findPage({ data: _params })
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
