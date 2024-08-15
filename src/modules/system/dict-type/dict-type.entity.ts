import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

import { CompleteEntity } from "~/entity/common.entity";

@Entity({ name: "sys_dict_type" })
export class DictTypeEntity extends CompleteEntity {
    @Column({ type: "varchar", length: 50, comment: "字典名称", nullable: true })
    @ApiProperty({ description: "字典名称" })
    name: string;

    @Column({ type: "varchar", length: 50, unique: true, comment: "字典编码" })
    @ApiProperty({ description: "字典编码" })
    code: string;

    @Column({ type: "tinyint", default: 1, comment: "状态：0-禁用，1-启用" })
    @ApiProperty({ description: " 状态" })
    status: number;

    @Column({ type: "varchar", nullable: true, comment: "备注", length: 255 })
    @ApiProperty({ description: "备注" })
    remark: string;
}
