import type { Dictionary } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { MenuTypeEnum, YesOrNoEnum } from '~shared/enums'
import { SysMenuEntity } from '../entities'

class FirstLevelSeeder extends Seeder {
  async run(em: EntityManager, context?: Dictionary) {
    context.systemMenu = em.create(SysMenuEntity, { menuName: '系统管理', menuKey: 'sys.menu.system', menuType: MenuTypeEnum.FOLDER, orderNum: 1, path: '/system', redirect: '/system/user', icon: 'ep:setting', isAvailable: YesOrNoEnum.YES, isVisible: YesOrNoEnum.YES })
    context.monitorMenu = em.create(SysMenuEntity, { menuName: '系统监控', menuKey: 'sys.menu.monitor', menuType: MenuTypeEnum.FOLDER, orderNum: 2, path: '/monitor', redirect: '/monitor/online', icon: 'ep:monitor', isAvailable: YesOrNoEnum.YES, isVisible: YesOrNoEnum.YES })

    context.menus.push(
      context.systemMenu,
      context.monitorMenu,
    )
  }
}

class SecondLevelSeeder extends Seeder {
  async run(em: EntityManager, context?: Dictionary) {
    const { systemMenu, monitorMenu } = context

    context.systemUserMenu = em.create(SysMenuEntity, { menuName: '用户管理', menuKey: 'sys.menu.system.user', menuType: MenuTypeEnum.MENU, orderNum: 1, path: 'user', component: 'system/user', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemDeptMenu = em.create(SysMenuEntity, { menuName: '部门管理', menuKey: 'sys.menu.system.dept', menuType: MenuTypeEnum.MENU, orderNum: 2, path: 'dept', component: 'system/dept', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemPostMenu = em.create(SysMenuEntity, { menuName: '岗位管理', menuKey: 'sys.menu.system.post', menuType: MenuTypeEnum.MENU, orderNum: 3, path: 'post', component: 'system/post', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemRoleMenu = em.create(SysMenuEntity, { menuName: '角色管理', menuKey: 'sys.menu.system.role', menuType: MenuTypeEnum.MENU, orderNum: 4, path: 'role', component: 'system/role', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemDictTypeMenu = em.create(SysMenuEntity, { menuName: '字典管理', menuKey: 'sys.menu.system.dictType', menuType: MenuTypeEnum.MENU, orderNum: 4, path: 'dict', component: 'system/dict', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemDictDataMenu = em.create(SysMenuEntity, { menuName: '字典数据', menuKey: 'sys.menu.system.dictData', menuType: MenuTypeEnum.MENU, orderNum: 5, path: 'dict/data', component: 'system/dict/data', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.NO, parentId: systemMenu.id })
    context.systemMenuMenu = em.create(SysMenuEntity, { menuName: '菜单管理', menuKey: 'sys.menu.system.menu', menuType: MenuTypeEnum.MENU, orderNum: 6, path: 'menu', component: 'system/menu', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemConfigMenu = em.create(SysMenuEntity, { menuName: '配置管理', menuKey: 'sys.menu.system.config', menuType: MenuTypeEnum.MENU, orderNum: 7, path: 'config', component: 'system/config', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemLangMenu = em.create(SysMenuEntity, { menuName: '词库管理', menuKey: 'sys.menu.system.lang', menuType: MenuTypeEnum.MENU, orderNum: 8, path: 'lang', component: 'system/lang', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: systemMenu.id })
    context.systemRoleAuthMenu = em.create(SysMenuEntity, { menuName: '角色分配用户', menuKey: 'sys.menu.system.roleAuth', menuType: MenuTypeEnum.MENU, orderNum: 9, path: 'role/auth', component: 'system/role/auth', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.NO, parentId: systemMenu.id })
    context.systemPostAuthMenu = em.create(SysMenuEntity, { menuName: '岗位分配用户', menuKey: 'sys.menu.system.postAuth', menuType: MenuTypeEnum.MENU, orderNum: 11, path: 'post/auth', component: 'system/post/auth', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.NO, parentId: systemMenu.id })
    context.systemRoleMenuMenu = em.create(SysMenuEntity, { menuName: '角色分配菜单', menuKey: 'sys.menu.system.roleMenu', menuType: MenuTypeEnum.BUTTON, orderNum: 10, isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.NO, parentId: systemMenu.id })
    context.monitorOnlineMenu = em.create(SysMenuEntity, { menuName: '在线用户', menuKey: 'sys.menu.monitor.online', menuType: MenuTypeEnum.MENU, orderNum: 1, path: 'online', component: 'monitor/online', isAvailable: YesOrNoEnum.YES, isCache: YesOrNoEnum.NO, isFrame: YesOrNoEnum.NO, isVisible: YesOrNoEnum.YES, parentId: monitorMenu.id })

    context.menus.push(
      context.systemUserMenu,
      context.systemDeptMenu,
      context.systemPostMenu,
      context.systemRoleMenu,
      context.systemDictTypeMenu,
      context.systemDictDataMenu,
      context.systemMenuMenu,
      context.systemConfigMenu,
      context.systemLangMenu,
      context.systemRoleAuthMenu,
      context.systemPostAuthMenu,
      context.systemRoleMenuMenu,
      context.monitorOnlineMenu,
    )
  }
}

class ThirdLevelSeeder extends Seeder {
  async run(em: EntityManager, context?: Dictionary) {
    const { systemUserMenu, systemDeptMenu, systemPostMenu, systemRoleMenu, systemDictTypeMenu, systemDictDataMenu, systemMenuMenu, systemConfigMenu, systemLangMenu, systemRoleAuthMenu, systemPostAuthMenu, systemRoleMenuMenu, monitorOnlineMenu } = context

    context.menus.push(
      em.create(SysMenuEntity, { menuName: '用户分页', menuKey: 'sys.menu.system.user.findPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemUserMenu.id }),
      em.create(SysMenuEntity, { menuName: '用户新增', menuKey: 'sys.menu.system.user.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemUserMenu.id }),
      em.create(SysMenuEntity, { menuName: '用户修改', menuKey: 'sys.menu.system.user.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemUserMenu.id }),
      em.create(SysMenuEntity, { menuName: '用户删除', menuKey: 'sys.menu.system.user.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemUserMenu.id }),
      em.create(SysMenuEntity, { menuName: '部门列表', menuKey: 'sys.menu.system.dept.findList', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemDeptMenu.id }),
      em.create(SysMenuEntity, { menuName: '部门新增', menuKey: 'sys.menu.system.dept.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemDeptMenu.id }),
      em.create(SysMenuEntity, { menuName: '部门编辑', menuKey: 'sys.menu.system.dept.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemDeptMenu.id }),
      em.create(SysMenuEntity, { menuName: '部门删除', menuKey: 'sys.menu.system.dept.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemDeptMenu.id }),
      em.create(SysMenuEntity, { menuName: '岗位分页', menuKey: 'sys.menu.system.post.findPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemPostMenu.id }),
      em.create(SysMenuEntity, { menuName: '岗位新增', menuKey: 'sys.menu.system.post.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemPostMenu.id }),
      em.create(SysMenuEntity, { menuName: '岗位编辑', menuKey: 'sys.menu.system.post.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemPostMenu.id }),
      em.create(SysMenuEntity, { menuName: '岗位删除', menuKey: 'sys.menu.system.post.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemPostMenu.id }),
      em.create(SysMenuEntity, { menuName: '角色分页', menuKey: 'sys.menu.system.role.findPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemRoleMenu.id }),
      em.create(SysMenuEntity, { menuName: '角色新增', menuKey: 'sys.menu.system.role.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemRoleMenu.id }),
      em.create(SysMenuEntity, { menuName: '角色编辑', menuKey: 'sys.menu.system.role.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemRoleMenu.id }),
      em.create(SysMenuEntity, { menuName: '角色删除', menuKey: 'sys.menu.system.role.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemRoleMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典分页', menuKey: 'sys.menu.system.dictType.findPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemDictTypeMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典新增', menuKey: 'sys.menu.system.dictType.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemDictTypeMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典编辑', menuKey: 'sys.menu.system.dictType.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemDictTypeMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典删除', menuKey: 'sys.menu.system.dictType.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemDictTypeMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典数据列表', menuKey: 'sys.menu.system.dictData.findList', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemDictDataMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典数据新增', menuKey: 'sys.menu.system.dictData.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemDictDataMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典数据编辑', menuKey: 'sys.menu.system.dictData.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemDictDataMenu.id }),
      em.create(SysMenuEntity, { menuName: '字典数据删除', menuKey: 'sys.menu.system.dictData.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemDictDataMenu.id }),
      em.create(SysMenuEntity, { menuName: '菜单列表', menuKey: 'sys.menu.system.menu.findList', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemMenuMenu.id }),
      em.create(SysMenuEntity, { menuName: '菜单新增', menuKey: 'sys.menu.system.menu.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemMenuMenu.id }),
      em.create(SysMenuEntity, { menuName: '菜单编辑', menuKey: 'sys.menu.system.menu.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemMenuMenu.id }),
      em.create(SysMenuEntity, { menuName: '菜单删除', menuKey: 'sys.menu.system.menu.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemMenuMenu.id }),
      em.create(SysMenuEntity, { menuName: '配置分页', menuKey: 'sys.menu.system.config.findPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemConfigMenu.id }),
      em.create(SysMenuEntity, { menuName: '配置新增', menuKey: 'sys.menu.system.config.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemConfigMenu.id }),
      em.create(SysMenuEntity, { menuName: '配置编辑', menuKey: 'sys.menu.system.config.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemConfigMenu.id }),
      em.create(SysMenuEntity, { menuName: '配置删除', menuKey: 'sys.menu.system.config.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemConfigMenu.id }),
      em.create(SysMenuEntity, { menuName: '词库分页', menuKey: 'sys.menu.system.lang.findPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemLangMenu.id }),
      em.create(SysMenuEntity, { menuName: '词库新增', menuKey: 'sys.menu.system.lang.create', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemLangMenu.id }),
      em.create(SysMenuEntity, { menuName: '词库编辑', menuKey: 'sys.menu.system.lang.update', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemLangMenu.id }),
      em.create(SysMenuEntity, { menuName: '词库删除', menuKey: 'sys.menu.system.lang.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemLangMenu.id }),
      em.create(SysMenuEntity, { menuName: '未分配用户分页', menuKey: 'sys.menu.system.roleAuth.findUnallocatedUserPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemRoleAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '已分配用户分页', menuKey: 'sys.menu.system.roleAuth.findAllocatedUserPage', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemRoleAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '分配用户', menuKey: 'sys.menu.system.roleAuth.allocateUser', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemRoleAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '取消分配用户', menuKey: 'sys.menu.system.roleAuth.unallocateUser', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemRoleAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '未分配用户分页', menuKey: 'sys.menu.system.postAuth.findUnallocatedUserPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemPostAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '已分配用户分页', menuKey: 'sys.menu.system.postAuth.findAllocatedUserPage', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemPostAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '分配用户', menuKey: 'sys.menu.system.postAuth.allocateUser', menuType: MenuTypeEnum.BUTTON, orderNum: 3, isAvailable: YesOrNoEnum.YES, parentId: systemPostAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '取消分配用户', menuKey: 'sys.menu.system.postAuth.unallocateUser', menuType: MenuTypeEnum.BUTTON, orderNum: 4, isAvailable: YesOrNoEnum.YES, parentId: systemPostAuthMenu.id }),
      em.create(SysMenuEntity, { menuName: '分配菜单', menuKey: 'sys.menu.system.roleMenu.assign', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: systemRoleMenuMenu.id }),
      em.create(SysMenuEntity, { menuName: '已分配菜单', menuKey: 'sys.menu.system.roleMenu.assigned', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: systemRoleMenuMenu.id }),
      em.create(SysMenuEntity, { menuName: '在线用户分页', menuKey: 'sys.menu.monitor.online.findPage', menuType: MenuTypeEnum.BUTTON, orderNum: 1, isAvailable: YesOrNoEnum.YES, parentId: monitorOnlineMenu.id }),
      em.create(SysMenuEntity, { menuName: '在线用户下线', menuKey: 'sys.menu.monitor.online.remove', menuType: MenuTypeEnum.BUTTON, orderNum: 2, isAvailable: YesOrNoEnum.YES, parentId: monitorOnlineMenu.id }),
    )
  }
}

export class SysMenuSeeder extends Seeder {
  async run(em: EntityManager, context?: Dictionary) {
    context.menus = []

    await this.call(em, [FirstLevelSeeder, SecondLevelSeeder, ThirdLevelSeeder], context)
  }
}
