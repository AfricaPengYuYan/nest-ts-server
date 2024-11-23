import { ApiProperty } from "@nestjs/swagger";

export class AccountInfo {
    @ApiProperty({ description: "用户名" })
    userName: string;

    @ApiProperty({ description: "昵称" })
    nickName: string;

    @ApiProperty({ description: "邮箱" })
    email: string;

    @ApiProperty({ description: "手机号" })
    phone: string;

    @ApiProperty({ description: "备注" })
    remark: string;

    @ApiProperty({ description: "头像" })
    avatar: string;
}
