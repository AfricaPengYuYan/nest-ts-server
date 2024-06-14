import { HttpException, Injectable } from "@nestjs/common";
import { UserService } from "./user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "~/modules/auth/user/user.entity";
import { verifyUser } from "~/modules/auth/user/user.utils";
import { AuthLoginDto, AuthRegisterDto } from "~/modules/auth/auth.dto";
import { AccessTokenFields } from "../base.dto";
import { Response } from "~/modules/result";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {
    }

    /**
     * 根据账号密码返回新的令牌(Token)
     * @param {Object} param
     * @param {string} param.account 账号
     * @param {string} param.password 密码
     */
    async login({ account, password }: AuthLoginDto) {
        const userInfo = await this.userService.findUserByAccountAndPassword(account, password);
        await verifyUser(userInfo);
        try {
            const payload = { userId: userInfo.userId, source: userInfo.source };
            const accessToken = await this.createToken(payload);
            return Response.success({ access_token: accessToken }, "欢迎回来");
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }

    /**
     * 根据 账号 密码 用户名称 进行注册
     * @async
     * @param {Object} param
     * @param {string} param.account 账号
     * @param {string} param.password 密码
     * @param {string} param.userName 用户名称
     */
    async register(param: AuthRegisterDto) {
        return this.userService.insert(param);
    }


    async getUserInfo() {

    }

    // -------------------------------------------------- Token 操作 --------------------------------------------------

    /**
     * 根据传递的参数生成令牌(Token)
     * @param {Object} param
     * @param {number} param.userId
     */
    async createToken(param: AccessTokenFields) {
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
