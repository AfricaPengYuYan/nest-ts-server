import { Exclude } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn, VirtualColumn } from 'typeorm';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

// 如果觉得前端转换时间太麻烦，并且不考虑通用性的话，可以在服务端进行转换，eg: @UpdateDateColumn({ name: 'updated_at', transformer })
// const transformer: ValueTransformer = {
//   to(value) {
//     return value
//   },
//   from(value) {
//     return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
//   },
// }

export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ comment: '创建时间', name: 'create_time' })
    createTime: Date;

    @UpdateDateColumn({ comment: '修改时间', name: 'update_time' })
    updateTime: Date;

    @VersionColumn({
        name: 'version',
        nullable: true,
        comment: '锁',
        type: 'int',
    })
    version: number;
}

export abstract class CompleteEntity extends CommonEntity {
    @ApiHideProperty()
    @Exclude()
    @Column({ name: 'create_by', update: false, comment: '创建者', nullable: true })
    createBy: number;

    @ApiHideProperty()
    @Exclude()
    @Column({ name: 'update_by', comment: '更新者', nullable: true })
    updateBy: number;

    /**
     * 不会保存到数据库中的虚拟列，数据量大时可能会有性能问题，有性能要求请考虑在 service 层手动实现
     * @see https://typeorm.io/decorator-reference#virtualcolumn
     */
    @ApiProperty({ description: '创建者' })
    @VirtualColumn({ query: (alias) => `SELECT username FROM sys_user WHERE id = ${alias}.create_by` })
    creator: string;

    @ApiProperty({ description: '更新者' })
    @VirtualColumn({ query: (alias) => `SELECT username FROM sys_user WHERE id = ${alias}.update_by` })
    updater: string;
}
