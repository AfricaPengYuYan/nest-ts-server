import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiResult } from "~/common/decorators/api-result.decorator";
import { Ip } from "~/common/decorators/http.decorator";
import { Public } from "~/common/decorators/public.decorator";
import { LocalGuard } from "~/common/guards/local.guard";
import { UserService } from "~/modules/system/user/user.service";
import { AuthService } from "./auth.service";

import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { LoginToken } from "./models/auth.model";
import { CaptchaService } from "./services/captcha.service";

@ApiTags("Auth - 认证模块")
@UseGuards(LocalGuard)
@Public()
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private captchaService: CaptchaService,
    ) {}

    @Post("login")
    @ApiOperation({ summary: "登录" })
    @ApiResult({ type: LoginToken })
    async login(@Body() dto: LoginDto, @Ip()ip: string, @Headers("user-agent")ua: string): Promise<LoginToken> {
        // await this.captchaService.checkImgCaptcha(dto.captchaId, dto.verifyCode);
        const token = await this.authService.login(dto.account, dto.password, ip, ua);
        return { token };
    }

    @Post("register")
    @ApiOperation({ summary: "注册" })
    async register(@Body() dto: RegisterDto): Promise<void> {
        await this.userService.register(dto);
    }
}
