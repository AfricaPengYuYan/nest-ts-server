import * as bcrypt from "bcryptjs";
import { HttpException } from "@nestjs/common";

/**
 * 加密
 * @param {string} password 原始数据
 * @return 返回加密后的字符串
 */
export async function encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

/**
 * 解密
 * @param {string} password 原始数据
 * @param {string} hashedPassword 加密后的数据
 * @return 成功解密返回 true
 */
export async function comparePasswords(password: string, hashedPassword: string) {
    if (!password || !hashedPassword) {
        throw new HttpException("需要提供 password 和 hashedPassword", 500);
    }
    return await bcrypt.compare(password, hashedPassword);
}
