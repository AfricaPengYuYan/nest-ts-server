import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsEmail, IsIn, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { isEmpty } from "lodash";

import { PageDto } from "~/common/dto/pager.dto";

export class UserDto {
    @ApiProperty({ description: "头像" })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ description: "登录账号", example: "admin" })
    @IsString()
    @Matches(/^[\s\S]+$/)
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty({ description: "登录密码", example: "a123456" })
    @IsOptional()
    @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
        message: "密码必须包含数字、字母，长度为6-16",
    })
    password: string;

    @ApiProperty({ description: "归属角色", type: [Number] })
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    roleIds: number[];

    @ApiProperty({ description: "归属大区", type: Number })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    deptId?: number;

    @ApiProperty({ description: "呢称", example: "admin" })
    @IsOptional()
    @IsString()
    nickname: string;

    @ApiProperty({ description: "邮箱", example: "bqy.dev@qq.com" })
    @IsEmail()
    @ValidateIf(o => !isEmpty(o.email))
    email: string;

    @ApiProperty({ description: "手机号" })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ description: "QQ" })
    @IsOptional()
    @IsString()
    @Matches(/^[1-9]\d{4,10}$/)
    @MinLength(5)
    @MaxLength(11)
    qq?: string;

    @ApiProperty({ description: "备注" })
    @IsOptional()
    @IsString()
    remark?: string;

    @ApiProperty({ description: "状态" })
    @IsIn([0, 1])
    status: number;
}

export class UpdateUserDto extends PartialType(UserDto) { }

export class QueryUserDto extends IntersectionType(PageDto<UserDto>, PartialType(UserDto)) {
    @ApiProperty({ description: "归属大区", example: 1, required: false })
    @IsInt()
    @IsOptional()
    deptId?: number;

    @ApiProperty({ description: "状态", example: 0, required: false })
    @IsInt()
    @IsOptional()
    status?: number;
}

export class UpdatePasswordDto {
    @ApiProperty({ description: "旧密码" })
    @IsString()
    @Matches(/^[\s\S]+$/)
    @MinLength(6)
    @MaxLength(20)
    oldPassword: string;

    @ApiProperty({ description: "新密码" })
    @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
        message: "密码必须包含数字、字母，长度为6-16",
    })
    newPassword: string;
}

export class EditPasswordDto {
    @ApiProperty({ description: "更改后的密码" })
    @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
        message: "密码格式不正确",
    })
    password: string;
}
