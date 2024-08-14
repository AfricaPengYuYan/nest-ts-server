import { Column, Entity, ManyToMany, Relation } from 'typeorm'

import { CompleteEntity } from '~/entity/common.entity'

import { RoleEntity } from '../role/role.entity'

@Entity({ name: 'sys_menu' })
export class MenuEntity extends CompleteEntity {
    @Column({ name: 'parent_id', nullable: true, type: 'int', comment: '父级id' })
    parentId: number

    @Column({ nullable: true, type: 'varchar', length: 50, comment: '菜单名称' })
    name: string

    @Column({ nullable: true, type: 'varchar', length: 100, comment: '菜单路径' })
    path: string

    @Column({ nullable: true, type: 'varchar', length: 255, comment: '权限标识' })
    permission: string

    @Column({ type: 'tinyint', default: 0, comment: '菜单类型：0目录 1菜单 2按钮' })
    type: number

    @Column({ default: '', type: 'varchar', length: 50, comment: '图标' })
    icon: string

    @Column({ name: 'sort', type: 'int', default: 0, comment: '排序' })
    sort: number

    @Column({ name: 'component', nullable: true, type: 'varchar', length: 255, comment: '组件路径' })
    component: string

    @Column({ name: 'is_ext', type: 'tinyint', default: 0, comment: '是否外链：0否 1是' })
    isExt: number

    @Column({ name: 'ext_open_mode', type: 'tinyint', default: 1, comment: '外链打开方式：1新窗口打开 2当前窗口打开' })
    extOpenMode: number

    @Column({ name: 'keep_alive', type: 'tinyint', default: 1, comment: '是否缓存：0否 1是' })
    keepAlive: number

    @Column({ type: 'tinyint', default: 1, comment: '是否显示：0否 1是' })
    show: number

    @Column({ name: 'active_menu', nullable: true, type: 'varchar', length: 100, comment: '激活菜单' })
    activeMenu: string

    @Column({ type: 'tinyint', default: 1, comment: '状态：0禁用 1启用' })
    status: number

    @ManyToMany(() => RoleEntity, role => role.menus, {
        onDelete: 'CASCADE',
    })
    roles: Relation<RoleEntity[]>
}
