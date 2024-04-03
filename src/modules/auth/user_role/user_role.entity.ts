import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sys_user_role")
export class UserRoleEntity {
    @PrimaryGeneratedColumn({ comment: "id", name: "id", type: "int" })
    id: number;

    @Column({ type: "int", nullable: true, name: "user_id", comment: "用户id" })
    userId: number;

    @Column({ type: "int", nullable: true, name: "role_id", comment: "角色id" })
    roleId: number;
}
