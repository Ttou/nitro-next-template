<script setup lang="ts">
import type { PlusPageProps } from 'plus-pro-components'
import { Icon } from '@iconify/vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { computed, ref, unref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { PermissionEnum, YesOrNoEnum } from '~shared/enums'
import { hasPermission } from '~web/directives'
import { t } from '~web/i18n'
import { useCreate } from './hooks'

const pageInstance = useTemplateRef('pageInstance')
const selectedIds = ref<string[]>([])

const route = useRoute()

const id = computed(() => route.query.id as string)

const pageProps = computed<PlusPageProps>(() => {
  return {
    columns: [
      {
        label: t('common.field.account'),
        prop: 'userName',
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
        hideInSearch: true,
        tableColumnProps: {
          align: 'center',
        },
      },
      {
        label: t('common.field.email'),
        prop: 'email',
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
        width: 180,
        tableColumnProps: {
          align: 'center',
        },
      },
    ],
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
      actionBar: {
        actionBarTableColumnProps: {
          align: 'center',
        },
        buttons: [
          {
            text: t('system.auth.button.revoke'),
            code: 'cancel',
            show: hasPermission(PermissionEnum.SYSTEM_POST_AUTH_UNALLOCATE_USER),
            props: { type: 'danger' },
            confirm: {
              message: ({ row }) => t('system.auth.confirm.revokeWithName', { name: row.userName }),
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
      return await Apis.SystemPostAuth.findAllocatedUserPage({
        data: {
          id: unref(id),
          ...params,
        },
      })
    },
    searchCardProps: {
      shadow: 'never',
    },
    tableCardProps: {
      shadow: 'never',
    },
  }
})

const { createVisible, createDialogProps, createPageProps, showCreate, confirmCreate } = useCreate({ pageInstance, id })

function confirmRemove(ids: string[], batch: boolean = false) {
  const handler = () => Apis.SystemPostAuth.unallocateUser({
    data: {
      id: unref(id),
      ids,
    },
  })
    .then(() => {
      ElNotification.success({
        title: t('common.title.notification'),
        message: t('system.auth.message.revokeSuccess'),
      })
      pageInstance.value?.getList()
    })

  if (batch) {
    if (!selectedIds.value.length) {
      ElMessage.warning(t('system.auth.message.selectDataToRevoke'))
      return
    }

    ElMessageBox.confirm(t('system.auth.confirm.revokeSelected'), {
      type: 'warning',
      title: t('common.title.tip'),
    })
      .then(() => {
        handler()
      })
      .catch(() => {})
  }
  else {
    handler()
  }
}
</script>

<template>
  <div>
    <plus-page ref="pageInstance" v-bind="pageProps">
      <template #table-title>
        <el-space>
          <el-button v-permission="PermissionEnum.SYSTEM_POST_AUTH_ALLOCATE_USER" type="primary" @click="showCreate">
            <template #icon>
              <Icon icon="ep:plus" />
            </template>
            {{ $t('system.auth.button.grant') }}
          </el-button>
          <el-button v-permission="PermissionEnum.SYSTEM_POST_AUTH_UNALLOCATE_USER" type="danger" @click="confirmRemove(selectedIds, true)">
            <template #icon>
              <Icon icon="ep:delete" />
            </template>
            {{ $t('system.auth.button.batchRevoke') }}
          </el-button>
        </el-space>
      </template>
    </plus-page>
    <!-- 新增 -->
    <plus-dialog
      v-model="createVisible"
      v-bind="createDialogProps"
      @confirm="confirmCreate"
    >
      <plus-page v-bind="createPageProps" />
    </plus-dialog>
  </div>
</template>
