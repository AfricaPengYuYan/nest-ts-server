import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

import { PageDto } from "~/dto/pager.dto";

export class QueryLoginLogDto extends PageDto {
    @ApiProperty({ description: "用户名" })
    @IsString()
    @IsOptional()
    username: string;

    @ApiProperty({ description: "登录IP" })
    @IsOptional()
    @IsString()
    ip?: string;

    @ApiProperty({ description: "登录地点" })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ description: "登录时间" })
    @IsOptional()
    @IsArray()
    time?: string[];
}

export class QueryTaskLogDto extends PageDto {
    @ApiProperty({ description: "用户名" })
    @IsOptional()
    @IsString()
    username: string;

    @ApiProperty({ description: "登录IP" })
    @IsString()
    @IsOptional()
    ip?: string;

    @ApiProperty({ description: "登录时间" })
    @IsOptional()
    time?: string[];
}

export class QueryCaptchaLogDto extends PageDto {
    @ApiProperty({ description: "用户名" })
    @IsOptional()
    @IsString()
    username: string;

    @ApiProperty({ description: "验证码" })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({ description: "发送时间" })
    @IsOptional()
    time?: string[];
}
