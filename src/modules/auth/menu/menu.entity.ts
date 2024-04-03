import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, VersionColumn } from "typeorm";

@Entity("sys_menu")
export class MenuEntity {
    @PrimaryGeneratedColumn({ comment: "菜单id", name: "menu_id", type: "int" })
    menuId: number;

    @Column({
        type: "varchar",
        nullable: true,
        length: 20,
        name: "menu_name",
        comment: "菜单名称",
    })
    menuName: string;

    @Column({
        type: "varchar",
        default: null,
        length: 20,
        name: "path",
        comment: "路由地址",
    })
    path: string;

    @Column({
        type: "char",
        default: null,
        name: "menu_type",
        comment: "菜单类型（M目录 C菜单 F按钮）",
    })
    menuType: string;

    @Column({ type: "int", default: null, name: "sort", comment: "显示顺序" })
    sort: number;

    @Column({
        type: "varchar",
        default: null,
        length: 30,
        name: "component",
        comment: "组件路径/外链",
    })
    component: string;

    @Column({
        type: "varchar",
        nullable: true,
        default: "default",
        length: 20,
        name: "icon",
        comment: "菜单icon",
    })
    icon: string;

    @Column({
        type: "int",
        nullable: true,
        default: 0,
        name: "parent_menu_id",
        comment: "父菜单id，默认是0",
    })
    parentMenuId: number;

    @Column({
        type: "varchar",
        nullable: true,
        default: null,
        length: 20,
        name: "permission",
        comment: "权限字符",
    })
    permission: string;

    @Column({
        type: "int",
        nullable: true,
        default: 0,
        name: "is_frame",
        comment: "是否是外链（0不是 1是）",
    })
    isFrame: number;

    @Column({
        type: "int",
        nullable: true,
        default: 0,
        name: "is_cache",
        comment: "是否缓存（0不缓存 1缓存）",
    })
    isCache: number;

    @Column({
        type: "int",
        nullable: true,
        default: 0,
        name: "visible",
        comment: "是否隐藏（0不隐藏 1隐藏）",
    })
    visible: number;

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
        default: null,
        length: 500,
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
