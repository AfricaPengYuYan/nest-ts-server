import { UserEntity } from "~/modules/auth/user/user.entity";
import { HttpException } from "@nestjs/common";

/**
 * 验证用户
 * @param {UserEntity} user - 要验证的用户实体对象
 * @returns {Promise<boolean>} 返回一个 Promise 对象，表示用户验证结果，如果验证通过返回 true，否则抛出异常
 * @throws {HttpException} 如果用户已被删除或已被禁用，则抛出 HttpException 异常
 */
export async function verifyUser(user: UserEntity): Promise<boolean> {
    // 是否删除
    if (user.isDelete) throw new HttpException("账号已被删除", 500);
    // 是否禁用
    if (user.isState) throw new HttpException("账号已被禁用", 500);

    return true;
}
