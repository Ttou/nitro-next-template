export const systemRoleMenuApi = {
  assign(params: AssignMenuForRoleDto) {
    return $fetch('/api/system/role/menu/assign', { method: 'POST', body: params })
  },
  assigned(params: FindAssignedMenuForRoleDto) {
    return $fetch('/api/system/role/menu/assigned', { method: 'POST', body: params })
  },
}
