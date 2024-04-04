import { HttpException, Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleService } from "../role/role.service";
import { MenuService } from "../menu/menu.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private readonly roleService: RoleService,
        private readonly menuService: MenuService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * 根据用户 ID 查询用户信息
     * @param {number} userId - 要查询的用户 ID
     * @returns {Promise<UserEntity>} 返回一个 Promise 对象，表示查询到的用户信息
     * @throws {HttpException} 如果用户 ID 为空或查询过程中出现异常，则抛出 HttpException 异常
     */
    async findById(userId: number): Promise<UserEntity> {
        if (!userId) throw new HttpException("用户id不能为空", 500);
        try {
            // 过滤部分信息
            return await this.repository.findOne({
                select: ["userId", "age", "sex", "userName", "account", "openId", "email", "createTime", "updateTime", "isState", "isDelete", "idCard", "source", "phone"],
                where: { userId },
            });
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }
}
