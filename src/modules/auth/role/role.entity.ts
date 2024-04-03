import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, VersionColumn } from "typeorm";

@Entity("sys_role")
export class RoleEntity {
    @PrimaryGeneratedColumn({ comment: "角色id", name: "role_id", type: "int" })
    roleId: number;

    @Column({ type: "int", default: null, name: "sort", comment: "显示顺序" })
    sort: number;

    @Column({
        type: "int",
        nullable: true,
        default: 1,
        name: "data_scope",
        comment: "数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）",
    })
    dataScope: number;

    @Column({
        type: "varchar",
        nullable: true,
        length: 20,
        name: "role_name",
        comment: "角色名称",
    })
    roleName: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 20,
        name: "role_key",
        comment: "角色权限字符串",
    })
    roleKey: string;

    @Column({
        type: "int",
        nullable: true,
        default: 0,
        comment: "是否是禁用/停用状态（0:不是 1:是）",
        name: "is_state",
    })
    isState: number;

    @Column({
        type: "int",
        nullable: true,
        default: 0,
        comment: "是否是删除状态（0:不是 1:是）",
        name: "is_delete",
    })
    isDelete: number;

    @Column({
        type: "timestamp",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
        comment: "创建时间",
        name: "create_time",
    })
    createTime: Date;

    @Column({
        type: "varchar",
        nullable: true,
        default: null,
        length: 20,
        name: "create_by",
        comment: "创建人",
    })
    createBy: string;

    @Column({
        type: "timestamp",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
        comment: "修改时间",
        name: "update_time",
    })
    updateTime: Date;

    @Column({
        type: "varchar",
        nullable: true,
        default: null,
        length: 20,
        name: "update_by",
        comment: "修改人",
    })
    updateBy: string;

    @VersionColumn({ name: "version", nullable: true, comment: "锁" })
    version: number;

    @Column({
        type: "varchar",
        length: 500,
        default: null,
        name: "remark",
        comment: "备注",
    })
    remark: string;

    @BeforeInsert()
    updateCreateTime() {
        this.createTime = new Date();
    }

    @BeforeUpdate()
    updateUpdateTime() {
        this.updateTime = new Date();
    }
}
