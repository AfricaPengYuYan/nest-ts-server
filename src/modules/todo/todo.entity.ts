import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";

import { CommonEntity } from "~/entity/common.entity";
import { UserEntity } from "~/modules/system/user/user.entity";

@Entity("todo")
export class TodoEntity extends CommonEntity {
    @Column({ type: "varchar", length: 255, nullable: true })
    @ApiProperty({ description: "todo" })
    value: string;

    @ApiProperty({ description: "todo" })
    @Column({ default: 0, type: "tinyint" })
    status: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;
}
