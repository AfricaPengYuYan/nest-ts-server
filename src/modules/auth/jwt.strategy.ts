import { RedisService } from "@/cache/redis.service";
import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { UserEntity } from "./user/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly redisService: RedisService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 请求被拒默认返回401未经授权的错误码
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>("jwt.secretKey"),
        });
    }

    /**
     * 验证用户并返回用户信息
     * @param {Request} req - HTTP 请求对象
     * @param {UserEntity} parse_user - 要验证的用户实体对象
     * @returns {Promise<UserEntity>} 返回一个 Promise 对象，表示验证后的用户实体对象
     * @throws {HttpException} 如果用户信息不完整、登录信息已过期或出现其他问题，则抛出 HttpException 异常
     * @throws {UnauthorizedException} 如果没有查询到用户信息，则抛出 UnauthorizedException 异常
     */
    async validate(req: Request, parse_user: UserEntity) {
        // 获取 Token
        const originToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        // 验证参数完整性
        if (!parse_user.userId && !parse_user.source) throw new HttpException("用户信息不完整", 500);
        // 判断是否过期
        const isExpired = await this.redisService.ttl(`auth_token_${parse_user.userId}_${parse_user.source}`);
        // 缓存中的 Token
        const cacheToken = await this.redisService.get(`auth_token_${parse_user.userId}_${parse_user.source}`);
        // 单点登录验证
        if (originToken !== cacheToken || isExpired <= 0) throw new HttpException("登录信息已过期，请重新登录", 500);
        // 查询出用户信息
        const result_user = await this.authService.validateUser(parse_user);
        // 没有用户信息
        if (!result_user) throw new UnauthorizedException("很抱歉，出现了一些问题");

        return result_user;
    }
}
