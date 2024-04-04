import { Reflector } from "@nestjs/core";
import { ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "~/modules/auth/auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const b = this.reflector.getAllAndOverride<boolean>(false, [ctx.getHandler(), ctx.getClass()]);
        if (b) return true;

        const req = ctx.switchToHttp().getRequest();
        const res = ctx.switchToHttp().getResponse();
        const temp_path = req.path;
        const ip = req.ip;
        // 拿到 temp_path 地址，根据 configService 里面的版本号判断是否有前缀，有就去掉
        const version = this.configService.get("system.versions");
        let path = temp_path;
        if (version) {
            const reg = new RegExp(`^/${version}`);
            path = temp_path.replace(reg, "");
        }

        // 白名单
        const whiteList = this.configService.get("whiteList");
        if (whiteList.includes(path)) return true;

        const accessToken = req.get("Authorization");
        if (!accessToken) throw new HttpException("请先登录！", 500);

        const value = await this.authService.validateAccessToken(accessToken);
        if (!value) throw new HttpException("当前登录状态已过期，请重新登录！", 500);

        return await this.activate(ctx);
    }

    async activate(ctx: ExecutionContext): Promise<boolean> {
        // @ts-ignore
        return super.canActivate(ctx);
    }
}
