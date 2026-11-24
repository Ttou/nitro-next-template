import type { TreeInstance } from 'element-plus'
import type { FieldValues, PlusDialogProps, PlusFormProps, PlusPageInstance } from 'plus-pro-components'
import type { Ref } from 'vue'
import type { AssignMenuForRoleReqDto, SysMenuEntityExcludeRelationDto } from '~web/apis/globals'
import { ElNotification, ElScrollbar, ElTree } from 'element-plus'
import { computed, h, ref, shallowRef, unref } from 'vue'
import { MenuTypeEnum } from '~shared/enums'
import { listToTree, toPayload } from '~web/utils'

interface UseAssignMenuParams {
  pageInstance: Ref<PlusPageInstance>
}

export function useAssignMenu({ pageInstance }: UseAssignMenuParams) {
  const assignMenuVisible = ref(false)
  const assignMenuValues = ref<Record<string, any>>({})
  const assignMenuConfirmLoading = ref(false)
  const menuTreeRef = shallowRef<TreeInstance>()
  const menuTree = ref<SysMenuEntityExcludeRelationDto[]>([])
  const checkedKeys = ref(new Set<string>())

  const assignMenuDialogProps = computed<PlusDialogProps>(() => ({
    title: '分配菜单',
    width: '700px',
    confirmLoading: unref(assignMenuConfirmLoading),
    destroyOnClose: true,
  }))

  const assignMenuFormProps = computed<PlusFormProps>(() => ({
    labelWidth: '120px',
    labelPosition: 'right',
    columns: [
      {
        label: '角色名称',
        prop: 'roleName',
        fieldProps: {
          disabled: true,
        },
      },
      {
        label: '角色菜单',
        prop: 'menuIds',
        renderField() {
          return h('div', {
            style: {
              width: '100%',
              height: '400px',
              padding: '10px',
              border: '1px solid #eee',
            },
          }, [
            h(ElScrollbar, {}, () => [
              h(ElTree, {
                'ref': menuTreeRef,
                'data': unref(menuTree),
                'nodeKey': 'id',
                'showCheckbox': true,
                'checkStrictly': true,
                'props': { label: 'menuName', children: 'children' },
                'style': { width: '100%' },
                'onCheck-change': (node, checked) => {
                  if (checked) {
                    checkedKeys.value.add(node.id)
                  }
                  else {
                    checkedKeys.value.delete(node.id)
                  }
                },
              }, {
                default: ({ data }: { data: SysMenuEntityExcludeRelationDto }) => `[${MenuTypeEnum.label(data.menuType)}] ${data.menuName}`,
              }),
            ]),
          ])
        },
      },
    ],
  }))

  async function showAssignMenu(params: any) {
    assignMenuVisible.value = true
    assignMenuConfirmLoading.value = true

    Object.assign(assignMenuValues.value, params)

    try {
      await Promise.all([
        getMenuIds(),
        getMenuTree(),
      ])
      assignMenuConfirmLoading.value = false
    }
    catch {
      assignMenuConfirmLoading.value = false
    }
  }

  async function confirmAssignMenu(values: FieldValues) {
    try {
      assignMenuConfirmLoading.value = true

      await Apis.SystemRoleMenu.assign({
        data: toPayload<AssignMenuForRoleReqDto>({
          ...values,
          menuIds: [...checkedKeys.value],
        }),
      })

      assignMenuValues.value = Object.create({})
      assignMenuVisible.value = false
      assignMenuConfirmLoading.value = false

      ElNotification.success({
        title: '通知',
        message: '分配成功',
      })

      pageInstance.value.getList()
    }
    catch {
      assignMenuConfirmLoading.value = false
    }
  }

  async function getMenuIds() {
    const menuIds = await Apis.SystemRoleMenu.assigned({
      data: { id: assignMenuValues.value.id },
    })

    menuIds.forEach((id) => {
      checkedKeys.value.add(id)
    })
    menuTreeRef.value?.setCheckedKeys(menuIds)
  }

  async function getMenuTree() {
    const list = await Apis.SystemMenu.findList({ data: {} })
    menuTree.value = listToTree(list)
  }

  return {
    assignMenuVisible,
    assignMenuValues,
    assignMenuDialogProps,
    assignMenuFormProps,
    showAssignMenu,
    confirmAssignMenu,
  }
}
