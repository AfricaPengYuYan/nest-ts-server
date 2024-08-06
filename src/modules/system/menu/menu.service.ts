import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, isEmpty, uniq } from 'lodash';
import { In, IsNull, Not, Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { MenuEntity } from './menu.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuEntity)
        private readonly repository: Repository<MenuEntity>,
        private roleService: RoleService,
    ) {}

    async getPermissions(uid: number): Promise<string[]> {
        const roleIds = await this.roleService.getRoleIdsByUser(uid);
        let permission: any[] = [];
        let result: any = null;
        if (this.roleService.hasAdminRole(roleIds)) {
            result = await this.repository.findBy({
                permission: Not(IsNull()),
                type: In([1, 2]),
            });
        } else {
            if (isEmpty(roleIds)) return permission;

            result = await this.repository
                .createQueryBuilder('menu')
                .innerJoinAndSelect('menu.roles', 'role')
                .andWhere('role.id IN (:...roleIds)', { roleIds })
                .andWhere('menu.type IN (1,2)')
                .andWhere('menu.permission IS NOT NULL')
                .getMany();
        }
        if (!isEmpty(result)) {
            result.forEach((e) => {
                if (e.permission) permission = concat(permission, e.permission.split(','));
            });
            permission = uniq(permission);
        }
        return permission;
    }
}
