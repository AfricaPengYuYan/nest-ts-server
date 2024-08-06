import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('sys_dept')
export class DeptEntity {
    @Column({
        type: 'int',
        default: null,
        name: 'parent_id',
        comment: '父部门id',
    })
    parentId: number;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 20,
        name: 'dept_name',
        comment: '部门名称',
    })
    deptName: string;

    @Column({ type: 'tinyint', default: null, name: 'sort', comment: '显示顺序' })
    sort: number;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 20,
        name: 'leader',
        comment: '负责人',
    })
    leader: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: null,
        name: 'phone',
        comment: '手机号码/联系电话',
    })
    phone: string;

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
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
        comment: '创建时间',
        name: 'create_time',
    })
    createTime: Date;

    @Column({
        type: 'varchar',
        nullable: true,
        default: null,
        length: 20,
        name: 'create_by',
        comment: '创建人',
    })
    createBy: string;

    @Column({
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
        comment: '修改时间',
        name: 'update_time',
    })
    updateTime: Date;

    @Column({
        type: 'varchar',
        nullable: true,
        default: null,
        length: 20,
        name: 'update_by',
        comment: '修改人',
    })
    updateBy: string;

    @BeforeInsert()
    updateCreateTime() {
        this.createTime = new Date();
    }

    @BeforeUpdate()
    updateUpdateTime() {
        this.updateTime = new Date();
    }
}
