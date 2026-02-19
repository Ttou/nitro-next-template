export interface paths {
    "/api/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 登录 */
        post: operations["AuthController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 退出 */
        post: operations["AuthController_logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/captcha/image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 图形验证码 */
        get: operations["CaptchaController_image"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/current-user/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取当前用户信息 */
        get: operations["CurrentUserController_getInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/current-user/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 获取当前用户个人信息 */
        get: operations["CurrentUserController_getProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/current-user/update-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新当前用户个人信息 */
        post: operations["CurrentUserController_updateProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/current-user/update-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新当前用户密码 */
        post: operations["CurrentUserController_updatePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/monitor/online/findPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 分页查询在线用户 */
        post: operations["MonitorOnlineController_findPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/monitor/online/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除在线用户 */
        delete: operations["MonitorOnlineController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/config/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建系统配置 */
        post: operations["SystemConfigController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/config/findByKey": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 根据键名查询系统配置 */
        get: operations["SystemConfigController_findByKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/config/findPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询系统配置分页列表 */
        post: operations["SystemConfigController_findPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/config/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除系统配置 */
        delete: operations["SystemConfigController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/config/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新系统配置 */
        post: operations["SystemConfigController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dept/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建部门 */
        post: operations["SystemDeptController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dept/findList": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询部门列表 */
        post: operations["SystemDeptController_findList"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dept/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除部门 */
        delete: operations["SystemDeptController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dept/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新部门 */
        post: operations["SystemDeptController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/type/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建字典类型 */
        post: operations["SystemDictTypeController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/type/findByKey": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 根据字典类型查询字典数据 */
        get: operations["SystemDictTypeController_findByKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/type/findPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 查询字典类型分页列表 */
        get: operations["SystemDictTypeController_findPage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/type/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除字典类型 */
        delete: operations["SystemDictTypeController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/type/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新字典类型 */
        post: operations["SystemDictTypeController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/data/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建字典数据 */
        post: operations["SystemDictDataController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/data/findList": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询字典数据列表 */
        post: operations["SystemDictDataController_findList"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/data/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除字典数据 */
        delete: operations["SystemDictDataController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/dict/data/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新字典数据 */
        post: operations["SystemDictDataController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/lang/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建系统语言 */
        post: operations["SystemLangController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/lang/findAll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 查询系统语言 */
        get: operations["SystemLangController_findAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/lang/findByKey": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** 查询系统语言词条 */
        get: operations["SystemLangController_findByKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/lang/findPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询系统语言词条分页 */
        post: operations["SystemLangController_findPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/lang/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 删除系统语言词条 */
        post: operations["SystemLangController_remove"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/lang/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新系统语言词条 */
        post: operations["SystemLangController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/menu/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建菜单 */
        post: operations["SystemMenuController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/menu/findList": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询菜单列表 */
        post: operations["SystemMenuController_findList"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/menu/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除菜单 */
        delete: operations["SystemMenuController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/menu/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新菜单 */
        post: operations["SystemMenuController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建岗位 */
        post: operations["SystemPostController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/findPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询岗位分页列表 */
        post: operations["SystemPostController_findPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除岗位 */
        delete: operations["SystemPostController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新岗位 */
        post: operations["SystemPostController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/auth/allocateUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 为岗位分配用户 */
        post: operations["SystemPostAuthController_allocateUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/auth/findAllocatedUserPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询岗位已分配用户分页 */
        post: operations["SystemPostAuthController_findAllocatedUserPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/auth/findUnallocatedUserPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询岗位未分配用户分页 */
        post: operations["SystemPostAuthController_findUnallocatedUserPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/post/auth/unallocateUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 为岗位取消分配用户 */
        post: operations["SystemPostAuthController_unallocateUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建系统角色 */
        post: operations["SystemRoleController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/findPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询系统角色分页列表 */
        post: operations["SystemRoleController_findPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除系统角色 */
        delete: operations["SystemRoleController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新系统角色 */
        post: operations["SystemRoleController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/auth/allocateUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 为角色分配用户 */
        post: operations["SystemRoleAuthController_allocateUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/auth/findAllocatedUserPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询角色已分配用户分页 */
        post: operations["SystemRoleAuthController_findAllocatedUserPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/auth/findUnallocatedUserPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询角色未分配用户分页 */
        post: operations["SystemRoleAuthController_findUnallocatedUserPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/auth/unallocateUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 为角色取消分配用户 */
        post: operations["SystemRoleAuthController_unallocateUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/menu/assign": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 为角色分配菜单 */
        post: operations["SystemRoleMenuController_assign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/role/menu/assigned": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询角色已分配菜单 */
        post: operations["SystemRoleMenuController_assigned"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/user/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 创建系统用户 */
        post: operations["SystemUserController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/user/findPage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 查询系统用户分页列表 */
        post: operations["SystemUserController_findPage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/user/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** 删除系统用户 */
        delete: operations["SystemUserController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/system/user/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** 更新系统用户 */
        post: operations["SystemUserController_update"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LoginReqDto: {
            /**
             * @description 账号
             * @example
             */
            userName: string;
            /**
             * @description 密码
             * @example
             */
            password: string;
            /**
             * @description 验证码编号
             * @example
             */
            captchaId: string;
            /**
             * @description 验证码值
             * @example
             */
            captchaValue: string;
        };
        LoginResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: string;
        };
        CaptchaImageData: {
            /**
             * @description 验证码ID
             * @example
             */
            captchaId: string;
            /**
             * @description 验证码图片
             * @example
             */
            captchaImage: string;
        };
        CaptchaImageResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["CaptchaImageData"];
        };
        SysMenuEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /**
             * Format: int64
             * @description 父菜单ID
             */
            parentId: number;
            /** @description 菜单名称 */
            menuName: string;
            /** @description 菜单键值 */
            menuKey: string;
            /**
             * @description 菜单类型
             * @enum {string}
             */
            menuType: "C" | "F" | "M";
            /** @description 排序 */
            orderNum: number;
            /** @description 路径 */
            path: string;
            /** @description 组件 */
            component: string;
            /** @description 重定向 */
            redirect: string;
            /** @description 图标 */
            icon: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /**
             * @description 是否缓存
             * @enum {string}
             */
            isCache: "0" | "1";
            /**
             * @description 是否内嵌
             * @enum {string}
             */
            isFrame: "0" | "1";
            /**
             * @description 是否显示
             * @enum {string}
             */
            isVisible: "0" | "1";
            /** @description 备注 */
            remark: string;
            /** @description 角色列表 */
            roles: components["schemas"]["SysRoleEntity"][];
        };
        SysPostEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 岗位键值 */
            postKey: string;
            /** @description 岗位名称 */
            postName: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark: string;
            /** @description 用户列表 */
            users: components["schemas"]["SysUserEntity"][];
        };
        SysUserEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 账号 */
            userName: string;
            /** @description 昵称 */
            nickName: string;
            /** @description 密码 */
            password: string;
            /** @description 邮箱 */
            email: string;
            /** @description 手机号码 */
            phone: string;
            /** @description 性别 */
            sex: string;
            /** @description 头像 */
            avatar: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /**
             * @description 是否删除
             * @enum {string}
             */
            isDelete: "0" | "1";
            /** @description 备注 */
            remark: string;
            /** @description 部门列表 */
            depts: components["schemas"]["SysDeptEntity"][];
            /** @description 岗位列表 */
            posts: components["schemas"]["SysPostEntity"][];
            /** @description 角色列表 */
            roles: components["schemas"]["SysRoleEntity"][];
        };
        SysRoleEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 角色键值 */
            roleKey: string;
            /** @description 角色名称 */
            roleName: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark: string;
            /** @description 部门列表 */
            depts: components["schemas"]["SysDeptEntity"][];
            /** @description 菜单列表 */
            menus: components["schemas"]["SysMenuEntity"][];
            /** @description 用户列表 */
            users: components["schemas"]["SysUserEntity"][];
        };
        SysDeptEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /**
             * Format: int64
             * @description 父部门ID
             */
            parentId: number;
            /** @description 部门键值 */
            deptKey: string;
            /** @description 部门名称 */
            deptName: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark: string;
            /** @description 角色 */
            roles: components["schemas"]["SysRoleEntity"][];
            /** @description 用户 */
            users: components["schemas"]["SysUserEntity"][];
        };
        OmitTypeClass: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 账号 */
            userName: string;
            /** @description 昵称 */
            nickName: string;
            /** @description 邮箱 */
            email: string;
            /** @description 手机号码 */
            phone: string;
            /** @description 性别 */
            sex: string;
            /** @description 头像 */
            avatar: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /**
             * @description 是否删除
             * @enum {string}
             */
            isDelete: "0" | "1";
            /** @description 备注 */
            remark: string;
            /** @description 部门列表 */
            depts: components["schemas"]["SysDeptEntity"][];
            /** @description 岗位列表 */
            posts: components["schemas"]["SysPostEntity"][];
            /** @description 角色列表 */
            roles: components["schemas"]["SysRoleEntity"][];
        };
        CurrentUserGetInfoResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["OmitTypeClass"];
        };
        CurrentUserGetProfileResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["OmitTypeClass"];
        };
        UpdateCurrentUserProfileReqDto: {
            /**
             * @description 昵称
             * @example
             */
            nickname?: string;
            /**
             * @description 手机号码
             * @example
             */
            phone?: string;
            /**
             * @description 邮箱
             * @example
             */
            email?: string;
            /**
             * @description 头像
             * @example
             */
            avatar?: string;
        };
        UpdateCurrentUserPasswordReqDto: {
            /**
             * @description 旧密码
             * @example
             */
            oldPassword: string;
            /**
             * @description 新密码
             * @example
             */
            newPassword: string;
            /**
             * @description 确认密码
             * @example
             */
            confirmPassword: string;
        };
        FindMonitorOnlinePageReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /** @description 用户名 */
            userName?: string;
            /** @description 昵称 */
            nickName?: string;
            /** @description 开始时间 */
            beginTime?: string;
            /** @description 结束时间 */
            endTime?: string;
        };
        SysOnlineEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 会话ID */
            tokenId: string;
            /** @description Token */
            token: string;
            /** @description IP地址 */
            ip: string;
            /** @description 位置 */
            location: string;
            /** @description 浏览器 */
            browser: string;
            /** @description 操作系统 */
            os: string;
            /**
             * Format: date-time
             * @description 登录时间
             */
            loginTime: string;
            /** @description 用户 */
            user: components["schemas"]["SysUserEntity"];
        };
        FindMonitorOnlinePageResDto: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysOnlineEntity"][];
        };
        RemoveReqDto: {
            /** @description 主键数组 */
            ids: string[];
        };
        CreateSystemConfigReqDto: {
            /** @description 参数名称 */
            configName: string;
            /** @description 参数标识 */
            configKey: string;
            /** @description 参数键值 */
            configValue: string;
            /**
             * @description 是否内置参数
             * @enum {string}
             */
            isBuiltin?: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
        };
        SysConfigEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 配置名称 */
            configName: string;
            /** @description 配置键值 */
            configKey: string;
            /** @description 配置值 */
            configValue: string;
            /**
             * @description 是否内置
             * @enum {string}
             */
            isBuiltin: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark: string;
        };
        FindSystemConfigByKeyResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["SysConfigEntity"];
        };
        FindSystemConfigPageReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /** @description 参数名称 */
            configName: string;
            /** @description 参数标识 */
            configKey: string;
            /**
             * @description 是否内置参数
             * @enum {string}
             */
            isBuiltin?: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 开始时间 */
            beginTime?: string;
            /** @description 结束时间 */
            endTime?: string;
        };
        FindSystemConfigPageData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysConfigEntity"][];
        };
        FindSystemConfigPageResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindSystemConfigPageData"];
        };
        UpdateSystemConfigReqDto: {
            /** @description 参数名称 */
            configName: string;
            /** @description 参数标识 */
            configKey: string;
            /** @description 参数键值 */
            configValue: string;
            /**
             * @description 是否内置参数
             * @enum {string}
             */
            isBuiltin?: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        CreateSystemDeptReqDto: {
            /**
             * Format: int64
             * @description 父部门ID
             */
            parentId?: number;
            /** @description 部门名称 */
            deptName?: string;
            /** @description 部门标识 */
            deptKey?: string;
            /**
             * @description 可用状态
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
        };
        FindSystemDeptListReqDto: {
            /** @description 部门名称 */
            deptName?: string;
            /** @description 部门标识 */
            deptKey?: string;
            /**
             * @description 可用状态
             * @enum {string}
             */
            isAvailable?: "0" | "1";
        };
        FindSystemDeptListResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["SysDeptEntity"][];
        };
        UpdateSystemDeptReqDto: {
            /**
             * Format: int64
             * @description 父部门ID
             */
            parentId?: number;
            /** @description 部门名称 */
            deptName?: string;
            /** @description 部门标识 */
            deptKey?: string;
            /**
             * @description 可用状态
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        CreateSystemDictTypeDto: {
            /** @description 字典名称 */
            dictName?: string;
            /** @description 字典类型 */
            dictType?: string;
            /**
             * @description 可用状态
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
        };
        SysDictDataEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 字典标签 */
            dictLabel: string;
            /** @description 字典值 */
            dictValue: string;
            /** @description 字典类型 */
            dictType: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark: string;
        };
        FindSystemDictDetailByKeyResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["SysDictDataEntity"][];
        };
        FindSystemDictTypePageReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /** @description 字典名称 */
            dictName?: string;
            /** @description 字典类型 */
            dictType?: string;
            /**
             * @description 可用状态
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 开始时间 */
            beginTime?: string;
            /** @description 结束时间 */
            endTime?: string;
        };
        SysDictTypeEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 字典名称 */
            dictName: string;
            /** @description 字典类型 */
            dictType: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark: string;
        };
        FindSystemDictTypePageData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysDictTypeEntity"][];
        };
        FindSystemDictTypePageResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindSystemDictTypePageData"];
        };
        UpdateSystemDictTypeReqDto: {
            /** @description 字典名称 */
            dictName?: string;
            /** @description 字典类型 */
            dictType?: string;
            /**
             * @description 可用状态
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        CreateSystemDictDataReqDto: {
            /** @description 字典标签 */
            dictLabel: string;
            /** @description 字典值 */
            dictValue: string;
            /** @description 字典类型 */
            dictType: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
        };
        FindSystemDictDataListReqDto: {
            /** @description 字典类型 */
            dictType: string;
            /** @description 字典标签 */
            dictLabel?: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
        };
        FindSystemDictDataListData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysDictDataEntity"][];
        };
        FindSystemDictDataListResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindSystemDictDataListData"];
        };
        UpdateSystemDictDataReqDto: {
            /** @description 字典标签 */
            dictLabel: string;
            /** @description 字典值 */
            dictValue: string;
            /** @description 字典类型 */
            dictType: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        FindSystemLangAllResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: Record<string, never>;
        };
        SysLangEntity: {
            /**
             * Format: int64
             * @description 主键
             */
            id: number;
            /** @description 创建人 */
            createBy: string;
            /** @description 创建时间 */
            createdAt: Record<string, never>;
            /** @description 更新人 */
            updateBy: string;
            /** @description 更新时间 */
            updatedAt: Record<string, never>;
            /** @description 语言键值 */
            langKey: string;
            /** @description 语言值 */
            langValue: string;
            /**
             * @description 是否内置
             * @enum {string}
             */
            isBuiltin: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark: string;
        };
        FindSystemLangOneResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["SysLangEntity"][];
        };
        FindSystemLangPageReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /** @description 词条标识 */
            langKey?: string;
            /** @description 备注 */
            remark?: string;
            /**
             * @description 是否内置
             * @enum {string}
             */
            isBuiltin?: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 开始时间 */
            beginTime?: string;
            /** @description 结束时间 */
            endTime?: string;
        };
        Page: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysLangEntity"][];
        };
        FindSystemLangPageResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["Page"][];
        };
        UpdateSystemLangReqDto: {
            /** @description 词条标识 */
            langKey: string;
            /** @description 词条值 */
            langValue: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        CreateSystemMenuReqDto: {
            /**
             * Format: int64
             * @description 父菜单ID
             */
            parentId?: number;
            /** @description 菜单标识 */
            menuKey: string;
            /** @description 菜单名称 */
            menuName: string;
            /**
             * @description 菜单类型
             * @enum {string}
             */
            menuType: "C" | "F" | "M";
            /** @description 菜单排序 */
            orderNum: number;
            /** @description 路由地址 */
            path?: string;
            /** @description 组件 */
            component?: string;
            /** @description 重定向 */
            redirect?: string;
            /** @description 图标 */
            icon?: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /**
             * @description 是否外链
             * @enum {string}
             */
            isFrame?: "0" | "1";
            /**
             * @description 是否缓存
             * @enum {string}
             */
            isCache?: "0" | "1";
            /**
             * @description 是否显示
             * @enum {string}
             */
            isVisible?: "0" | "1";
            /** @description 备注 */
            remark?: string;
        };
        FindSystemMenuListReqDto: {
            /** @description 菜单名称 */
            menuName?: string;
            /** @description 菜单标识 */
            menuKey?: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
        };
        FindSystemMenuListResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["SysMenuEntity"][];
        };
        UpdateSystemMenuReqDto: {
            /**
             * Format: int64
             * @description 父菜单ID
             */
            parentId?: number;
            /** @description 菜单标识 */
            menuKey: string;
            /** @description 菜单名称 */
            menuName: string;
            /**
             * @description 菜单类型
             * @enum {string}
             */
            menuType: "C" | "F" | "M";
            /** @description 菜单排序 */
            orderNum: number;
            /** @description 路由地址 */
            path?: string;
            /** @description 组件 */
            component?: string;
            /** @description 重定向 */
            redirect?: string;
            /** @description 图标 */
            icon?: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /**
             * @description 是否外链
             * @enum {string}
             */
            isFrame?: "0" | "1";
            /**
             * @description 是否缓存
             * @enum {string}
             */
            isCache?: "0" | "1";
            /**
             * @description 是否显示
             * @enum {string}
             */
            isVisible?: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        CreateSystemPostReqDto: {
            /** @description 岗位名称 */
            postName: string;
            /** @description 岗位标识 */
            postKey: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
        };
        FindSystemPostPageReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /** @description 岗位标识 */
            postKey?: string;
            /** @description 岗位名称 */
            postName?: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 开始时间 */
            beginTime?: string;
            /** @description 结束时间 */
            endTime?: string;
        };
        FindSystemPostPageData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysPostEntity"][];
        };
        FindSystemPostPageResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindSystemPostPageData"];
        };
        UpdateSystemPostReqDto: {
            /** @description 岗位名称 */
            postName: string;
            /** @description 岗位标识 */
            postKey: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        AllocateUserForPostReqDto: {
            /**
             * Format: int64
             * @description 岗位ID
             */
            id: number;
            /** @description 用户ID数组 */
            ids: string[];
        };
        FindAllocatedUserPageForPostReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /**
             * Format: int64
             * @description 岗位ID
             */
            id: number;
            /** @description 用户名 */
            userName?: string;
            /** @description 昵称 */
            nickName?: string;
        };
        FindAllocatedUserPageForPostData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysUserEntity"][];
        };
        FindAllocatedUserPageForPostResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindAllocatedUserPageForPostData"];
        };
        FindUnallocatedUserPageForPostReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /**
             * Format: int64
             * @description 岗位ID
             */
            id: number;
            /** @description 用户名 */
            userName?: string;
            /** @description 昵称 */
            nickName?: string;
        };
        FindUnallocatedUserPageForPostResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindAllocatedUserPageForPostData"];
        };
        UnallocateUserForPostReqDto: {
            /**
             * Format: int64
             * @description 岗位ID
             */
            id: number;
            /** @description 用户ID数组 */
            ids: string[];
        };
        CreateSystemRoleReqDto: {
            /** @description 角色名称 */
            roleName: string;
            /** @description 角色标识 */
            roleKey: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
        };
        FindSystemRolePageReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /** @description 角色名称 */
            roleName?: string;
            /** @description 角色标识 */
            roleKey?: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 开始时间 */
            beginTime?: string;
            /** @description 结束时间 */
            endTime?: string;
        };
        FindSystemRolePageData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysRoleEntity"][];
        };
        FindSystemRolePageResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindSystemRolePageData"];
        };
        UpdateSystemRoleReqDto: {
            /** @description 角色名称 */
            roleName: string;
            /** @description 角色标识 */
            roleKey: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /** @description 备注 */
            remark?: string;
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
        FindAllocatedUserPageForRoleData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysUserEntity"][];
        };
        FindAllocatedUserPageForRoleResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindAllocatedUserPageForRoleData"];
        };
        FindUnallocatedUserPageForRoleResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindAllocatedUserPageForRoleData"];
        };
        FindAssignedMenuForRoleResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: string[];
        };
        CreateSystemUserReqDto: {
            /** @description 用户名 */
            userName: string;
            /** @description 昵称 */
            nickName: string;
            /** @description 密码 */
            password: string;
            /** @description 性别 */
            sex?: string;
            /** @description 手机号码 */
            phone?: string;
            /** @description 邮箱 */
            email?: string;
            /** @description 备注 */
            remark?: string;
            /**
             * @description 是否删除
             * @enum {string}
             */
            isDelete?: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
        };
        FindSystemUserPageReqDto: {
            /**
             * @description 页码
             * @default 1
             */
            page: number;
            /**
             * @description 页长
             * @default 15
             */
            pageSize: number;
            /** @description 用户名 */
            userName?: string;
            /** @description 昵称 */
            nickName?: string;
            /** @description 手机号码 */
            phone?: string;
            /** @description 邮箱 */
            email?: string;
            /** @description 性别 */
            sex?: string;
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
        };
        FindSystemUserPageData: {
            /** @description 页码 */
            page: number;
            /** @description 页长 */
            pageSize: number;
            /** @description 总数 */
            total: number;
            /** @description 列表 */
            data: components["schemas"]["SysUserEntity"][];
        };
        FindSystemUserPageResDto: {
            /**
             * @description 时间戳
             * @example 1606827398000
             */
            timestamp: number;
            /**
             * @description 状态码
             * @example 200
             */
            status: number;
            /** @description 响应数据 */
            data: components["schemas"]["FindSystemUserPageData"];
        };
        UpdateSystemUserReqDto: {
            /** @description 用户名 */
            userName: string;
            /** @description 昵称 */
            nickName: string;
            /** @description 密码 */
            password: string;
            /** @description 性别 */
            sex?: string;
            /** @description 手机号码 */
            phone?: string;
            /** @description 邮箱 */
            email?: string;
            /** @description 备注 */
            remark?: string;
            /**
             * @description 是否删除
             * @enum {string}
             */
            isDelete?: "0" | "1";
            /**
             * @description 是否可用
             * @enum {string}
             */
            isAvailable?: "0" | "1";
            /**
             * Format: int64
             * @description ID
             */
            id: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AuthController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResDto"];
                };
            };
        };
    };
    AuthController_logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CaptchaController_image: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CaptchaImageResDto"];
                };
            };
        };
    };
    CurrentUserController_getInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurrentUserGetInfoResDto"];
                };
            };
        };
    };
    CurrentUserController_getProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurrentUserGetProfileResDto"];
                };
            };
        };
    };
    CurrentUserController_updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCurrentUserProfileReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CurrentUserController_updatePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCurrentUserPasswordReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MonitorOnlineController_findPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindMonitorOnlinePageReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindMonitorOnlinePageResDto"];
                };
            };
        };
    };
    MonitorOnlineController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemConfigController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemConfigReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemConfigController_findByKey: {
        parameters: {
            query: {
                /** @description 参数键名 */
                configKey: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemConfigByKeyResDto"];
                };
            };
        };
    };
    SystemConfigController_findPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemConfigPageReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemConfigPageResDto"];
                };
            };
        };
    };
    SystemConfigController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemConfigController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemConfigReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDeptController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemDeptReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDeptController_findList: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemDeptListReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemDeptListResDto"];
                };
            };
        };
    };
    SystemDeptController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDeptController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemDeptReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDictTypeController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemDictTypeDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDictTypeController_findByKey: {
        parameters: {
            query: {
                /** @description 字典类型 */
                dictType: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemDictDetailByKeyResDto"];
                };
            };
        };
    };
    SystemDictTypeController_findPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemDictTypePageReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemDictTypePageResDto"];
                };
            };
        };
    };
    SystemDictTypeController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDictTypeController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemDictTypeReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDictDataController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemDictDataReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDictDataController_findList: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemDictDataListReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemDictDataListResDto"];
                };
            };
        };
    };
    SystemDictDataController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemDictDataController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemDictDataReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemLangController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemLangController_findAll: {
        parameters: {
            query: {
                /** @description 词条编码 */
                langCode: "en_US" | "zh_CN";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemLangAllResDto"];
                };
            };
        };
    };
    SystemLangController_findByKey: {
        parameters: {
            query: {
                /** @description 词条标识 */
                langKey: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemLangOneResDto"];
                };
            };
        };
    };
    SystemLangController_findPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemLangPageReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemLangPageResDto"];
                };
            };
        };
    };
    SystemLangController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemLangController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemLangReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemMenuController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemMenuReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemMenuController_findList: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemMenuListReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemMenuListResDto"];
                };
            };
        };
    };
    SystemMenuController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemMenuController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemMenuReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemPostController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemPostReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemPostController_findPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemPostPageReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemPostPageResDto"];
                };
            };
        };
    };
    SystemPostController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemPostController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemPostReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemPostAuthController_allocateUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AllocateUserForPostReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemPostAuthController_findAllocatedUserPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindAllocatedUserPageForPostReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindAllocatedUserPageForPostResDto"];
                };
            };
        };
    };
    SystemPostAuthController_findUnallocatedUserPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindUnallocatedUserPageForPostReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindUnallocatedUserPageForPostResDto"];
                };
            };
        };
    };
    SystemPostAuthController_unallocateUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnallocateUserForPostReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemRoleController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemRoleReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemRoleController_findPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemRolePageReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemRolePageResDto"];
                };
            };
        };
    };
    SystemRoleController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemRoleController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemRoleReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemRoleAuthController_allocateUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemRoleAuthController_findAllocatedUserPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindAllocatedUserPageForRoleResDto"];
                };
            };
        };
    };
    SystemRoleAuthController_findUnallocatedUserPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindUnallocatedUserPageForRoleResDto"];
                };
            };
        };
    };
    SystemRoleAuthController_unallocateUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemRoleMenuController_assign: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemRoleMenuController_assigned: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindAssignedMenuForRoleResDto"];
                };
            };
        };
    };
    SystemUserController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSystemUserReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemUserController_findPage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FindSystemUserPageReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FindSystemUserPageResDto"];
                };
            };
        };
    };
    SystemUserController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveReqDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SystemUserController_update: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSystemUserReqDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
