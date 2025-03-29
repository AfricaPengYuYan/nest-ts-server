declare global {
    /** 认证用户信息接口 */
    interface IAuthUser {
        /** 用户ID */
        uid: number;
        /** 密码版本号 */
        pv: number;
        /** 过期时间 */
        exp?: number;
        /** 签发时间 */
        iat?: number;
        /** 用户角色列表 */
        roles?: string[];
    }

    /** 基础响应接口 */
    export interface IBaseResponse<T = any> {
        /** 响应消息 */
        message: string;
        /** 响应状态码 */
        code: number;
        /** 响应数据 */
        data?: T;
    }

    /** 列表数据响应接口 */
    export interface IListResponseData<T = any> {
        /** 列表项数组 */
        items: T[];
    }
}

export { };
