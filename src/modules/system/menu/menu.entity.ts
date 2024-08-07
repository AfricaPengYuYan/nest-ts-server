import { Column, Entity, ManyToMany, Relation } from 'typeorm'

import { CompleteEntity } from '~/common/entity/common.entity'

import { RoleEntity } from '../role/role.entity'

@Entity('sys_menu')
export class MenuEntity extends CompleteEntity {
    @Column({
        type: 'varchar',
        nullable: true,
        length: 20,
        name: 'menu_name',
        comment: '菜单名称',
    })
    menuName: string

    @Column()
    name: string

    @Column({
        type: 'varchar',
        default: null,
        length: 20,
        name: 'path',
        comment: '路由地址',
    })
    path: string

    @Column({ name: 'order_no', type: 'int', nullable: true, default: 0 })
    orderNo: number

    @Column({
        type: 'char',
        default: null,
        name: 'menu_type',
        comment: '菜单类型（M目录 C菜单 F按钮）',
    })
    menuType: string

    @Column({ type: 'tinyint', default: 0 })
    type: number

    @Column({ type: 'tinyint', default: null, name: 'sort', comment: '显示顺序' })
    sort: number

    @Column({
        type: 'varchar',
        default: null,
        length: 30,
        name: 'component',
        comment: '组件路径/外链',
    })
    component: string

    @Column({
        type: 'varchar',
        nullable: true,
        default: 'default',
        length: 20,
        name: 'icon',
        comment: '菜单icon',
    })
    icon: string

    @Column({ name: 'parent_id', nullable: true })
    parentId: number

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        name: 'parent_menu_id',
        comment: '父菜单id，默认是0',
    })
    parentMenuId: number

    @Column({ name: 'keep_alive', type: 'tinyint', default: 1 })
    keepAlive: number

    @Column({
        type: 'varchar',
        nullable: true,
        default: null,
        length: 20,
        name: 'permission',
        comment: '权限字符',
    })
    permission: string

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        name: 'is_frame',
        comment: '是否是外链（0不是 1是）',
    })
    isFrame: number

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        name: 'is_cache',
        comment: '是否缓存（0不缓存 1缓存）',
    })
    isCache: number

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        name: 'visible',
        comment: '是否隐藏（0不隐藏 1隐藏）',
    })
    visible: number

    @Column({ type: 'tinyint', default: 1 })
    status: number

    @Column({ name: 'is_ext', type: 'boolean', default: false })
    isExt: boolean

    @Column({ type: 'tinyint', default: 1 })
    show: number

    @Column({ name: 'ext_open_mode', type: 'tinyint', default: 1 })
    extOpenMode: number

    @Column({ name: 'active_menu', nullable: true })
    activeMenu: string

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        comment: '是否是禁用/停用状态（0:不是 1:是）',
        name: 'is_state',
    })
    isState: number

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        comment: '是否是删除状态（0:不是 1:是）',
        name: 'is_delete',
    })
    isDelete: number

    @Column({
        type: 'varchar',
        default: null,
        length: 500,
        name: 'remark',
        comment: '备注',
    })
    remark: string

    @ManyToMany(() => RoleEntity, role => role.menus, {
        onDelete: 'CASCADE',
    })
    roles: Relation<RoleEntity[]>
}
