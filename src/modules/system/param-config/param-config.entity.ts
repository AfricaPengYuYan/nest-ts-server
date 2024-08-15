import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

import { CommonEntity } from "~/entity/common.entity";

@Entity({ name: "sys_config" })
export class ParamConfigEntity extends CommonEntity {
    @Column({ type: "varchar", length: 50, nullable: true, comment: "配置项" })
    @ApiProperty({ description: "配置名" })
    name: string;

    @Column({ type: "varchar", length: 50, unique: true, comment: "配置键名" })
    @ApiProperty({ description: "配置键名" })
    key: string;

    @Column({ type: "varchar", nullable: true, length: 50, comment: "配置值" })
    @ApiProperty({ description: "配置值" })
    value: string;

    @Column({ type: "varchar", nullable: true, comment: "配置描述", length: 255 })
    @ApiProperty({ description: "配置描述" })
    remark: string;
}
