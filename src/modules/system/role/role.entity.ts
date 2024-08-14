import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm'

import { CompleteEntity } from '~/entity/common.entity'

import { UserEntity } from '~/modules/system/user/user.entity'

import { MenuEntity } from '../menu/menu.entity'

@Entity({ name: 'sys_role' })
export class RoleEntity extends CompleteEntity {
    @Column({ unique: true, type: 'varchar', length: 50, comment: '角色名' })
    @ApiProperty({ description: '角色名' })
    name: string

    @Column({ unique: true, type: 'varchar', length: 50, comment: '角色标识' })
    @ApiProperty({ description: '角色标识' })
    value: string

    @Column({ nullable: true, type: 'varchar', length: 255, comment: '角色描述' })
    @ApiProperty({ description: '角色描述' })
    remark: string

    @Column({ type: 'tinyint', default: 1, comment: '状态：1启用，0禁用' })
    @ApiProperty({ description: '状态：1启用，0禁用' })
    status: number

    @Column({ nullable: true, type: 'tinyint', comment: '是否默认用户' })
    @ApiProperty({ description: '是否默认用户' })
    default: number

    @ApiHideProperty()
    @ManyToMany(() => UserEntity, user => user.roles)
    users: Relation<UserEntity[]>

    @ApiHideProperty()
    @ManyToMany(() => MenuEntity, menu => menu.roles, {})
    @JoinTable({
        name: 'sys_role_menu',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    })
    menus: Relation<MenuEntity[]>
}
