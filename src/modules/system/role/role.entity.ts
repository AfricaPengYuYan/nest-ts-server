import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm';
import { CompleteEntity } from '~/common/entity/common.entity';
import { MenuEntity } from '../menu/menu.entity';
import { UserEntity } from '../user/user.entity';

@Entity('sys_role')
export class RoleEntity extends CompleteEntity {
    @Column({ type: 'tinyint', default: null, name: 'sort', comment: '显示顺序' })
    sort: number;

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 1,
        name: 'data_scope',
        comment: '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
    })
    dataScope: number;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 20,
        name: 'role_name',
        comment: '角色名称',
    })
    roleName: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 20,
        name: 'role_key',
        comment: '角色权限字符串',
    })
    roleKey: string;

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        comment: '是否是禁用/停用状态（0:不是 1:是）',
        name: 'is_state',
    })
    isState: number;

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        comment: '是否是删除状态（0:不是 1:是）',
        name: 'is_delete',
    })
    isDelete: number;

    @Column({
        type: 'varchar',
        length: 500,
        default: null,
        name: 'remark',
        comment: '备注',
    })
    remark: string;

    @ApiHideProperty()
    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: Relation<UserEntity[]>;

    @ApiHideProperty()
    @ManyToMany(() => MenuEntity, (menu) => menu.roles, {})
    @JoinTable({
        name: 'sys_role_menus',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    })
    menus: Relation<MenuEntity[]>;
}
