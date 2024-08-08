import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { concat, isEmpty, uniq } from 'lodash'
import { In, IsNull, Not, Repository } from 'typeorm'

import { MenuEntity } from '~/modules/system/menu/menu.entity'

import { generatorRouters } from '~/utils'

import { RoleService } from '../role/role.service'

@Injectable()
export class MenuService {
    constructor(
    @InjectRepository(MenuEntity)
        private repository: Repository<MenuEntity>,
    private roleService: RoleService,
    ) { }

    async getPermissions(uid: number): Promise<string[]> {
        const roleIds = await this.roleService.getRoleIdsByUser(uid)
        let permission: any[] = []
        let result: any = null
        if (this.roleService.hasAdminRole(roleIds)) {
            result = await this.repository.findBy({
                permission: Not(IsNull()),
                type: In([1, 2]),
            })
        }
        else {
            if (isEmpty(roleIds))
                return permission

            result = await this.repository
                .createQueryBuilder('menu')
                .innerJoinAndSelect('menu.roles', 'role')
                .andWhere('role.id IN (:...roleIds)', { roleIds })
                .andWhere('menu.type IN (1,2)')
                .andWhere('menu.permission IS NOT NULL')
                .getMany()
        }
        if (!isEmpty(result)) {
            result.forEach((e) => {
                if (e.permission)
                    permission = concat(permission, e.permission.split(','))
            })
            permission = uniq(permission)
        }
        return permission
    }

    async getMenus(uid: number) {
        const roleIds = await this.roleService.getRoleIdsByUser(uid)
        let menus: MenuEntity[] = []

        if (isEmpty(roleIds))
            return generatorRouters([])

        if (this.roleService.hasAdminRole(roleIds)) {
            menus = await this.repository.find({ order: { orderNo: 'ASC' } })
        }
        else {
            menus = await this.repository
                .createQueryBuilder('menu')
                .innerJoinAndSelect('menu.roles', 'role')
                .andWhere('role.id IN (:...roleIds)', { roleIds })
                .orderBy('menu.order_no', 'ASC')
                .getMany()
        }

        const menuList = generatorRouters(menus)
        return menuList
    }
}
