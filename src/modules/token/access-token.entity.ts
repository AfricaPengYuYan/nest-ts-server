import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { UserEntity } from "~/modules/system/user/user.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";

@Entity("user_access_token")
export class AccessTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 500, type: "varchar", comment: "令牌值", nullable: true })
    value!: string;

    @Column({ comment: "令牌过期时间", type: "datetime", nullable: true })
    expired_time!: Date;

    @CreateDateColumn({ comment: "令牌创建时间", type: "datetime", nullable: true })
    created_time!: Date;

    @OneToOne(() => RefreshTokenEntity, refreshToken => refreshToken.access_token, {
        cascade: true,
    })
    refresh_token!: RefreshTokenEntity;

    @ManyToOne(() => UserEntity, user => user.access_tokens, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user_id" })
    user!: UserEntity;
}
