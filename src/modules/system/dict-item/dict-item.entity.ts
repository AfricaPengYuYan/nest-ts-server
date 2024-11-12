import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { CompleteEntity } from "~/entity/common.entity";

import { DictTypeEntity } from "../dict-type/dict-type.entity";

@Entity({ name: "sys_dict_item" })
export class DictItemEntity extends CompleteEntity {
    @ManyToOne(() => DictTypeEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "type_id" })
    type: DictTypeEntity;

    @Column({ nullable: true, comment: "字典项排序", type: "int" })
    sort: number;

    @Column({ type: "varchar", length: 50, comment: "字典项键名", nullable: true })
    @ApiProperty({ description: "字典项键名" })
    label: string;

    @Column({ type: "varchar", length: 50, comment: "字典项键值", nullable: true })
    @ApiProperty({ description: "字典项值" })
    value: string;

    @Column({ type: "tinyint", default: 1, comment: "字典项状态：0-禁用，1-启用" })
    @ApiProperty({ description: " 状态" })
    status: number;

    @Column({ type: "varchar", nullable: true, comment: "备注" })
    @ApiProperty({ description: "备注" })
    remark: string;
}
