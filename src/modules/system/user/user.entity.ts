import { Check, Column, Entity, JoinTable, ManyToMany, OneToMany, Relation } from 'typeorm';
import { CompleteEntity } from '~/common/entity/common.entity';
import { AccessTokenEntity } from '~/modules/auth/token/access-token.entity';
import { RoleEntity } from '../role/role.entity';

@Entity({ name: 'sys_user' })
@Check(`"age" > 0`)
export class UserEntity extends CompleteEntity {
    @Column({ type: 'varchar', default: null, length: 20, name: 'user_name', comment: '用户真实名称' })
    userName: string;

    @Column({ type: 'varchar', default: null, length: 20, name: 'nick_name', comment: '用户昵称' })
    nickName: string;

    @Column({
        unique: true,
        type: 'varchar',
        default: null,
        length: 20,
        name: 'account',
        comment: '账号',
    })
    account: string;

    @Column({
        type: 'varchar',
        default: null,
        length: 20,
        name: 'open_id',
        comment: '唯一标识',
    })
    openId: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 20,
        name: 'password',
        comment: '密码',
    })
    password: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 100,
        name: 'salt_password',
        comment: '加盐密码',
    })
    saltPassword: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: null,
        name: 'phone',
        comment: '手机号码',
    })
    phone: string;

    @Column({
        type: 'tinyint',
        nullable: true,
        name: 'source',
        comment: '来源（0表示PC端后台注册 1表示小程序 2表示H5公众号）',
    })
    source: number;

    @Column({
        type: 'tinyint',
        nullable: true,
        default: 0,
        name: 'sex',
        comment: '性别（0表示女 1表示男）',
    })
    sex: number;

    @Column({ type: 'tinyint', default: null, name: 'age', comment: '年龄' })
    age: number;

    @Column({
        type: 'int',
        default: null,
        name: 'id_card',
        comment: '身份证',
    })
    idCard: number;

    @Column({
        type: 'varchar',
        default: null,
        length: 50,
        name: 'email',
        comment: '邮箱',
    })
    email: string;

    @Column({
        type: 'tinyint',
        default: 0,
        nullable: true,
        name: 'is_super',
        comment: '是否为超级管理员（1表示是 0表示不是）',
    })
    isSuper: number;

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

    @ManyToMany(() => RoleEntity, (role) => role.users)
    @JoinTable({
        name: 'sys_user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Relation<RoleEntity[]>;

    @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
        cascade: true,
    })
    accessTokens: Relation<AccessTokenEntity[]>;
}
