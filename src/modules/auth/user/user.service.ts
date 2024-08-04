import { HttpException, Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleService } from "../role/role.service";
import { MenuService } from "../menu/menu.service";
import { ConfigService } from "@nestjs/config";
import { AuthRegisterDto } from "~/modules/auth/auth.dto";
import { verifyUser } from "~/modules/auth/user/user.utils";
import { Response } from "~/modules/result";
import { comparePasswords, encryptPassword } from "~/utils/bcrypt";

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

    /**
     * 根据账号和密码查找用户信息
     * @async
     * @param {string} account - 用户账号
     * @param {string} password - 用户密码
     * @param {boolean} isSpecial - 特殊流程，默认对查询的结果进行验空
     * @returns {Promise<UserEntity>} 返回一个 Promise 对象，表示查找到的用户信息
     * @throws {HttpException} 如果账号或密码为空
     * @throws {HttpException} 如果在数据库查询不到
     */
    async findUserByAccountAndPassword(account: string, password: string, isSpecial: boolean = true): Promise<UserEntity> {
        if (!account || !password) {
            throw new HttpException("账号或密码不能为空", 500);
        }
        const userInfo = await this.repository.findOne({
            where: { account },
        });
        if (userInfo) {
            const verifyPasswordExample = await comparePasswords(password, userInfo.saltPassword);
            if (!verifyPasswordExample && isSpecial) {
                throw new HttpException("账号或密码错误", 500);
            }
        } else if (isSpecial) throw new HttpException("很抱歉，未找到该账号的相关信息", 500);

        delete userInfo.password;
        delete userInfo.saltPassword;
        return userInfo;
    }

    /**
     * 根据 账号 密码 用户名称 进行注册
     * @desc 判断是否注册过，是否禁用、删除
     * @async
     * @param {Object} param
     * @param {string} param.account 账号
     * @param {string} param.password 密码
     * @param {string} param.userName 用户名称
     * @throws {HttpException} 运行注册 SQL 失败
     * @return {Promise<Response<any>>} 判断是否已注册过
     * @return {Promise<Response<any>>} 注册成功
     */
    async insert(param: AuthRegisterDto): Promise<Response<any>> {
        // 判断是不是注册过但是禁用或者删除了，所以先进行查询
        const userInfo = await this.findUserByAccountAndPassword(param.account, param.password, false);
        if (userInfo) {
            await verifyUser(userInfo);
            return Response.success(null, "账号已被注册");
        }
        // 注册
        try {
            // 密码加盐
            const saltPassword = await encryptPassword(param.password);
            await this.repository.save({ ...param, saltPassword });
            return Response.success(null, "注册成功");
        } catch (e) {
            throw new HttpException(e.message, 500);
        }
    }
}
