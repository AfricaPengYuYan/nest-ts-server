import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sys_role_dept")
export class RoleDeptEntity {
    @PrimaryGeneratedColumn({ comment: "id", name: "id", type: "int" })
    id: number;

    @Column({ type: "int", nullable: true, name: "role_id", comment: "角色id" })
    roleId: number;

    @Column({ type: "int", nullable: true, name: "dept_id", comment: "部门id" })
    deptId: number;
}
