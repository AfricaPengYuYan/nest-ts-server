export type ResponseType = {
    code: number;
    message: string;
    data: any;
    total: number;
};

export class Response<T = any> {
    readonly code: number;
    readonly data: T;
    readonly message: string;
    readonly total: number;

    constructor(code: number, message: string, data = null, total?: number) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.total = total;
    }

    // 数据
    static success<T = any>(data: T = null, message = "success") {
        return new Response(200, message, data);
    }

    // 数据
    static successTotal<T = any>(data: T = null, total: number, message = "success") {
        return new Response(200, message, data, total);
    }
}
