import { HttpException, Injectable } from "@nestjs/common";
import { UserService } from "./user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "~/modules/auth/user/user.entity";
import { verifyUser } from "~/modules/auth/user/user.utils";
import { AuthLoginDto, AuthRegisterDto } from "~/modules/auth/auth.dto";
import { TokenFields } from "../base.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {
    }

    /**
     * 根据账号密码返回新的令牌(Token)
     * @param account 账号
     * @param password 密码
     */
    async login({ account, password }: AuthLoginDto) {
        const userInfo = await this.userService.findUserByAccountAndPassword(account, password);
        await verifyUser(userInfo);
        try {
            const payload = { userId: userInfo.userId, source: userInfo.source };
            const accessToken = await this.createToken(payload);
            return { access_token: accessToken };
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }

    async register(param: AuthRegisterDto) {
        // 判断是不是注册过但是禁用了
        const userInfo = await this.userService.findUserByAccountAndPassword(param.account, param.password, false);
        if (userInfo) {
            return await verifyUser(userInfo);
        }

    }

    /**
     * 根据传递的参数生成令牌(Token)
     * @param {Object} param
     * @param {number} param.userId
     */
    async createToken(param: TokenFields) {
        return this.jwtService.sign(param);
    }

    /**
     * 验证访问令牌是否有效
     * @param {string} accessToken - 要验证的访问令牌
     * @returns {Promise<any>} 返回包含验证结果的 Promise 对象
     */
    async validateAccessToken(accessToken: string): Promise<any> {
        return await this.jwtService.verifyAsync(accessToken.replace("Bearer", ""));
    }

    /**
     * 验证用户【是否删除、禁用 状态】并返回用户信息
     * @param {UserEntity} param - 要验证的用户实体对象
     * @returns {Promise<UserEntity>} 返回一个 Promise 对象，表示经过验证后的用户实体对象
     */
    async validateUser(param: UserEntity): Promise<UserEntity> {
        const { userId } = param;
        const result_user = await this.userService.findById(userId);
        // 用户状态
        const verifyResult = await verifyUser(result_user);
        if (verifyResult) return result_user;
    }
}
