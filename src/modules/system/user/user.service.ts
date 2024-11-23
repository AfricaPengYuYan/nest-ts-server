import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";
import { isEmpty, isNil } from "lodash";
import { EntityManager, In, Like, Repository } from "typeorm";

import { InjectRedis } from "~/common/decorators/inject-redis.decorator";
import { HttpApiException } from "~/common/exceptions/http.api.exception";
import { ErrorEnum } from "~/constants/error-code.constant";
import { ROOT_ROLE_ID, SYS_USER_INITPASSWORD } from "~/constants/system.constant";
import { genAuthPermKey, genAuthPVKey, genAuthTokenKey, genOnlineUserKey } from "~/helper/genRedisKey";
import { paginate } from "~/helper/paginate";

import { Pagination } from "~/helper/paginate/pagination";
import { AccountUpdateDto } from "~/modules/auth/dto/account.dto";
import { RegisterDto } from "~/modules/auth/dto/auth.dto";
import { DeptEntity } from "~/modules/system/dept/dept.entity";
import { ParamConfigService } from "~/modules/system/param-config/param-config.service";
import { RoleEntity } from "~/modules/system/role/role.entity";
import { AccessTokenEntity } from "~/modules/token/access-token.entity";
import { QQService } from "~/shared/helper/qq.service";
import { md5, randomValue } from "~/utils";
import { UserStatus } from "./user.constant";

import { QueryUserDto, UpdatePasswordDto, UpdateUserDto, UserDto } from "./user.dto";
import { UserEntity } from "./user.entity";

import { AccountInfo } from "./user.model";

@Injectable()
export class UserService {
    constructor(
        @InjectRedis()
        private readonly redis: Redis,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
        @InjectEntityManager()
        private entityManager: EntityManager,

        private readonly paramConfigService: ParamConfigService,
        private readonly qqService: QQService,
    ) { }

    async findUserById(id: number): Promise<UserEntity | undefined> {
        return this.userRepository
            .createQueryBuilder("user")
            .where({
                id,
                status: UserStatus.Enabled,
            })
            .getOne();
    }

    async findUserByUserName(userName: string): Promise<UserEntity | undefined> {
        return this.userRepository
            .createQueryBuilder("user")
            .where({
                userName,
                status: UserStatus.Enabled,
            })
            .getOne();
    }

    async findUserByAccount(account: string): Promise<UserEntity | undefined> {
        return this.userRepository
            .createQueryBuilder("user")
            .where({
                account,
                status: UserStatus.Enabled,
            })
            .getOne();
    }

    async getAccountInfo(uid: number): Promise<AccountInfo> {
        const user: UserEntity = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.roles", "role")
            .where(`user.id = :uid`, { uid })
            .getOne();

        if (isEmpty(user))
            throw new HttpApiException(ErrorEnum.USER_NOT_FOUND);

        delete user?.psalt;

        return user;
    }

    async updateAccountInfo(uid: number, info: AccountUpdateDto): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: uid });
        if (isEmpty(user))
            throw new HttpApiException(ErrorEnum.USER_NOT_FOUND);

        const data = {
            ...(info.nickName ? { nickName: info.nickName } : null),
            ...(info.avatar ? { avatar: info.avatar } : null),
            ...(info.email ? { email: info.email } : null),
            ...(info.phone ? { phone: info.phone } : null),
            ...(info.qq ? { qq: info.qq } : null),
            ...(info.remark ? { remark: info.remark } : null),
        };

        if (!info.avatar && info.qq) {
            // 如果qq不等于原qq，则更新qq头像
            if (info.qq !== user.qq)
                data.avatar = await this.qqService.getAvater(info.qq);
        }

        await this.userRepository.update(uid, data);
    }

    async updatePassword(uid: number, dto: UpdatePasswordDto): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: uid });
        if (isEmpty(user))
            throw new HttpApiException(ErrorEnum.USER_NOT_FOUND);

        const comparePassword = md5(`${dto.oldPassword}${user.psalt}`);
        // 原密码不一致，不允许更改
        if (user.password !== comparePassword)
            throw new HttpApiException(ErrorEnum.PASSWORD_MISMATCH);

        const password = md5(`${dto.newPassword}${user.psalt}`);
        await this.userRepository.update({ id: uid }, { password });
        await this.upgradePasswordV(user.id);
    }

    async forceUpdatePassword(uid: number, password: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: uid });

        const newPassword = md5(`${password}${user.psalt}`);
        await this.userRepository.update({ id: uid }, { password: newPassword });
        await this.upgradePasswordV(user.id);
    }

    async create({ userName, password, roleIds, deptId, ...data }: UserDto): Promise<void> {
        const exists = await this.userRepository.findOneBy({
            userName,
        });
        if (!isEmpty(exists))
            throw new HttpApiException(ErrorEnum.SYSTEM_USER_EXISTS);

        await this.entityManager.transaction(async (manager) => {
            const salt = randomValue(32);

            if (!password) {
                const initPassword = await this.paramConfigService.findValueByKey(
                    SYS_USER_INITPASSWORD,
                );
                password = md5(`${initPassword ?? "123456"}${salt}`);
            }
            else {
                password = md5(`${password ?? "123456"}${salt}`);
            }
            const u = manager.create(UserEntity, {
                userName,
                password,
                ...data,
                psalt: salt,
                roles: await this.roleRepository.findBy({ id: In(roleIds) }),
                dept: await DeptEntity.findOneBy({ id: deptId }),
            });

            const result = await manager.save(u);
            return result;
        });
    }

    async update(id: number, { password, deptId, roleIds, status, ...data }: UpdateUserDto): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            if (password)
                await this.forceUpdatePassword(id, password);

            await manager.update(UserEntity, id, {
                ...data,
                status,
            });

            const user = await this.userRepository
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.roles", "roles")
                .leftJoinAndSelect("user.dept", "dept")
                .where("user.id = :id", { id })
                .getOne();
            if (roleIds) {
                await manager
                    .createQueryBuilder()
                    .relation(UserEntity, "roles")
                    .of(id)
                    .addAndRemove(roleIds, user.roles);
            }
            if (deptId) {
                await manager
                    .createQueryBuilder()
                    .relation(UserEntity, "dept")
                    .of(id)
                    .set(deptId);
            }

            if (status === 0) {
                // 禁用状态
                await this.forbidden(id);
            }
        });
    }

    async info(id: number): Promise<UserEntity> {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.roles", "roles")
            .leftJoinAndSelect("user.dept", "dept")
            .where("user.id = :id", { id })
            .getOne();

        delete user.password;
        delete user.psalt;

        return user;
    }

    async delete(userIds: number[]): Promise<void | never> {
        const rootUserId = await this.findRootUserId();
        if (userIds.includes(rootUserId))
            throw new BadRequestException("不能删除root用户!");

        await this.userRepository.delete(userIds);
    }

    async findRootUserId(): Promise<number> {
        const user = await this.userRepository.findOneBy({
            roles: { id: ROOT_ROLE_ID },
        });
        return user.id;
    }

    async list({ page, pageSize, userName, nickName, deptId, email, status }: QueryUserDto): Promise<Pagination<UserEntity>> {
        const queryBuilder = this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.dept", "dept")
            .leftJoinAndSelect("user.roles", "role")
            .where({
                ...(userName ? { userName: Like(`%${userName}%`) } : null),
                ...(nickName ? { nickName: Like(`%${nickName}%`) } : null),
                ...(email ? { email: Like(`%${email}%`) } : null),
                ...(!isNil(status) ? { status } : null),
            });

        if (deptId)
            queryBuilder.andWhere("dept.id = :deptId", { deptId });

        return paginate<UserEntity>(queryBuilder, {
            page,
            pageSize,
        });
    }

    async forbidden(uid: number, accessToken?: string): Promise<void> {
        await this.redis.del(genAuthPVKey(uid));
        await this.redis.del(genAuthTokenKey(uid));
        await this.redis.del(genAuthPermKey(uid));
        if (accessToken) {
            const token = await AccessTokenEntity.findOne({
                where: { value: accessToken },
            });
            this.redis.del(genOnlineUserKey(token.id));
        }
    }

    async multiForbidden(uids: number[]): Promise<void> {
        if (uids) {
            const pvs: string[] = [];
            const ts: string[] = [];
            const ps: string[] = [];
            uids.forEach((uid) => {
                pvs.push(genAuthPVKey(uid));
                ts.push(genAuthTokenKey(uid));
                ps.push(genAuthPermKey(uid));
            });
            await this.redis.del(pvs);
            await this.redis.del(ts);
            await this.redis.del(ps);
        }
    }

    async upgradePasswordV(id: number): Promise<void> {
        const v = await this.redis.get(genAuthPVKey(id));
        if (!isEmpty(v))
            await this.redis.set(genAuthPVKey(id), Number.parseInt(v) + 1);
    }

    async exist(userName: string) {
        const user = await this.userRepository.findOneBy({ userName });
        if (isNil(user))
            throw new HttpApiException(ErrorEnum.SYSTEM_USER_EXISTS);

        return true;
    }

    async register({ account, ...data }: RegisterDto): Promise<void> {
        const exists = await this.userRepository.findOneBy({
            account,
        });
        if (!isEmpty(exists))
            throw new HttpApiException(ErrorEnum.SYSTEM_USER_EXISTS);

        await this.entityManager.transaction(async (manager) => {
            const salt = randomValue(32);

            const password = md5(`${data.password ?? "a123456"}${salt}`);

            const u = manager.create(UserEntity, {
                account,
                password,
                status: 1,
                psalt: salt,
            });

            const user = await manager.save(u);

            return user;
        });
    }
}
