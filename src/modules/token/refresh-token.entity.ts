import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { AccessTokenEntity } from "./access-token.entity";

@Entity("user_refresh_token")
export class RefreshTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 500, type: "varchar", comment: "令牌值", nullable: true })
    value!: string;

    @Column({ comment: "令牌过期时间", type: "datetime", nullable: true })
    expired_time!: Date;

    @CreateDateColumn({ comment: "令牌创建时间", type: "datetime", nullable: true })
    created_time!: Date;

    @OneToOne(() => AccessTokenEntity, accessToken => accessToken.refresh_token, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    access_token!: AccessTokenEntity;
}
