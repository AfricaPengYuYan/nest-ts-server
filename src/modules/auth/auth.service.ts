import { Injectable } from "@nestjs/common";
import { UserService } from "./user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "~/modules/auth/user/user.entity";
import { verifyUser } from "~/modules/auth/user/user.utils";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    /**
     * 验证访问令牌是否有效
     * @param {string} accessToken - 要验证的访问令牌
     * @returns {Promise<any>} 返回包含验证结果的 Promise 对象
     */
    async validateAccessToken(accessToken: string): Promise<any> {
        return await this.jwtService.verifyAsync(accessToken.replace("Bearer", ""));
    }

    /**
     * 验证用户并返回用户信息
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
