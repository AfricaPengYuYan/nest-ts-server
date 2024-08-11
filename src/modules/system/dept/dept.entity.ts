import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import {
    Column,
    Entity,
    OneToMany,
    Relation,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm'

import { CompleteEntity } from '~/entity/common.entity'

import { UserEntity } from '~/modules/system/user/user.entity'

@Entity({ name: 'sys_dept' })
@Tree('materialized-path')
export class DeptEntity extends CompleteEntity {
    @Column({ comment: '部门名称', length: 50, nullable: true, type: 'varchar' })
    @ApiProperty({ description: '部门名称' })
    name: string

    @Column({ nullable: true, default: 0, comment: '排序', type: 'int' })
    @ApiProperty({ description: '排序' })
    order_no: number

    @TreeChildren({ cascade: true })
    children: DeptEntity[]

    @TreeParent({ onDelete: 'SET NULL' })
    parent?: DeptEntity

    @ApiHideProperty()
    @OneToMany(() => UserEntity, user => user.dept)
    users: Relation<UserEntity[]>
}
