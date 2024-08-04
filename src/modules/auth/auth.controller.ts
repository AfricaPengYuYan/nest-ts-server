import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthLoginDto, AuthRegisterDto } from "~/modules/auth/auth.dto";

@ApiTags("认证授权")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: "PC端登录", description: "PC端用户登录成功返回令牌(Token)" })
    @Post("login")
    async login(@Body() param: AuthLoginDto) {
        return await this.authService.login(param);
    }

    @ApiOperation({ summary: "PC端注册", description: "PC端用户注册" })
    @Post("register")
    async register(@Body() param: AuthRegisterDto) {
        return this.authService.register(param);
    }

    @ApiOperation({ summary: "获取用户信息", description: "根据令牌(Token)去获取用户信息" })
    @Get()
    async getUserInfo() {
        return this.authService.getUserInfo();
    }
}
