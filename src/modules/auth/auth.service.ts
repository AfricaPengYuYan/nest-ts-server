import {HttpException, Injectable} from "@nestjs/common";
import {UserService} from "./user/user.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {
    }

    /**
     * 验证访问令牌是否有效
     * @param {string} accessToken - 要验证的访问令牌
     * @returns {Promise<any>} 返回包含验证结果的 Promise 对象
     */
    async validateAccessToken(accessToken: string): Promise<any> {
        return await this.jwtService.verifyAsync(accessToken.replace("Bearer", ""));
    }
}
