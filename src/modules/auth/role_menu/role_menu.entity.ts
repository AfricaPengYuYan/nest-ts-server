import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sys_role_menu")
export class RoleMenuEntity {
    @PrimaryGeneratedColumn({ comment: "id", name: "id", type: "int" })
    id: number;

    @Column({ type: "int", nullable: true, name: "role_id", comment: "角色id" })
    roleId: number;

    @Column({ type: "int", nullable: true, name: "menu_id", comment: "菜单id" })
    menuId: number;
}
