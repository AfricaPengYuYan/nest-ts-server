import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, Relation } from "typeorm";

import { CommonEntity } from "~/entity/common.entity";

import { DeptEntity } from "~/modules/system/dept/dept.entity";
import { RoleEntity } from "~/modules/system/role/role.entity";
import { AccessTokenEntity } from "~/modules/token/access-token.entity";

@Entity({ name: "sys_user" })
export class UserEntity extends CommonEntity {
    @Column({ unique: true, comment: "用户名", type: "varchar", length: 50 })
    username: string;

    @Exclude()
    @Column({ nullable: true, comment: "密码", type: "varchar", length: 50 })
    password: string;

    @Column({ nullable: true, comment: "密码盐", type: "varchar", length: 50 })
    psalt: string;

    @Column({ nullable: true, comment: "昵称", type: "varchar", length: 50 })
    nickname: string;

    @Column({ nullable: true, comment: "头像", type: "varchar", length: 255 })
    avatar: string;

    @Column({ nullable: true, comment: "QQ号", type: "varchar", length: 50 })
    qq: string;

    @Column({ nullable: true, comment: "邮箱", type: "varchar", length: 50 })
    email: string;

    @Column({ nullable: true, comment: "手机号", type: "varchar", length: 50 })
    phone: string;

    @Column({ nullable: true, comment: "备注", type: "varchar", length: 255 })
    remark: string;

    @Column({ comment: "状态：1-启用, 0-禁用", type: "tinyint", default: 1 })
    status: number;

    @ManyToMany(() => RoleEntity, role => role.users)
    @JoinTable({
        name: "sys_user_role",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
    })
    roles: Relation<RoleEntity[]>;

    @ManyToOne(() => DeptEntity, dept => dept.users)
    @JoinColumn({ name: "dept_id" })
    dept: Relation<DeptEntity>;

    @OneToMany(() => AccessTokenEntity, accessToken => accessToken.user, {
        cascade: true,
    })
    access_tokens: Relation<AccessTokenEntity[]>;
}
