import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

//登录
export class AuthLoginDto {
    @ApiProperty({ example: "admin", description: "账号", required: true })
    @IsNotEmpty()
    @IsString()
    account: string; //账号

    @ApiProperty({ example: "Aa123456!", description: "密码", required: true })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @IsString()
    password: string; //密码
}

//注册
export class AuthRegisterDto {
    userName: string; //用户名称
    account: string; //账号
    password: string; //密码
    nickName?: string; //用户昵称
}
