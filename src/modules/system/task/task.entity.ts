import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

import { CommonEntity } from "~/entity/common.entity";

@Entity({ name: "sys_task" })
export class TaskEntity extends CommonEntity {
    @Column({ type: "varchar", length: 50, unique: true, comment: "任务名" })
    @ApiProperty({ description: "任务名" })
    name: string;

    @Column({ type: "varchar", length: 50, unique: true, comment: "任务标识" })
    @ApiProperty({ description: "任务标识" })
    service: string;

    @Column({ type: "tinyint", default: 0, comment: "任务类型 0cron 1间隔" })
    @ApiProperty({ description: "任务类型 0cron 1间隔" })
    type: number;

    @Column({ type: "tinyint", default: 1, comment: "任务状态 0禁用 1启用" })
    @ApiProperty({ description: "任务状态 0禁用 1启用" })
    status: number;

    @Column({ name: "start_time", type: "datetime", nullable: true, comment: "开始时间" })
    @ApiProperty({ description: "开始时间" })
    startTime: Date;

    @Column({ name: "end_time", type: "datetime", nullable: true, comment: "结束时间" })
    @ApiProperty({ description: "结束时间" })
    endTime: Date;

    @Column({ type: "int", default: 0, comment: "间隔时间" })
    @ApiProperty({ description: "间隔时间" })
    limit: number;

    @Column({ nullable: true, comment: "cron表达式", type: "varchar", length: 100 })
    @ApiProperty({ description: "cron表达式" })
    cron: string;

    @Column({ type: "int", nullable: true, comment: "执行次数" })
    @ApiProperty({ description: "执行次数" })
    every: number;

    @Column({ type: "text", nullable: true, comment: "任务参数" })
    @ApiProperty({ description: "任务参数" })
    data: string;

    @Column({ name: "job_opts", type: "text", nullable: true, comment: "任务配置" })
    @ApiProperty({ description: "任务配置" })
    jobOpts: string;

    @Column({ nullable: true, comment: "任务描述", type: "varchar", length: 255 })
    @ApiProperty({ description: "任务描述" })
    remark: string;
}
