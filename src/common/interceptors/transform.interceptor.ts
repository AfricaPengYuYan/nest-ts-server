import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { instanceToPlain } from "class-transformer";
import { Response, ResponseType } from "~/modules/result";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.getArgByIndex(1).req;
        return next.handle().pipe(
            map((response) => {
                // instanceToPlain 可以帮助你获得一个干净的、只包含数据的对象。
                const result = instanceToPlain<ResponseType>(response);
                const { data, total = null, message } = result;
                // 返回带总条数
                if (total) return Response.successTotal(data, total, message);
                // 不是分页返回，直接返回
                return Response.success(data, message);
            }),
        );
    }

    /**
     * 打印日志
     * @param request 请求
     * @param result 返回值
     * @param binary 是否是二进制
     * @private
     */
    private printLog(request, result, binary = false) {
        // 判断是不是二进制
        const data = () => {
            // 判断r是不是null或者undefined
            if ([null, undefined].includes(result)) return "[null, undefined]：" + result;
            // 判断是不是二进制
            else if (binary) return "[二进制]：" + result;
            // 正常返回
            else return result.data;
        };
        return ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            Request original url: ${request.originalUrl}
            Method: ${request.method}
            IP: ${request.ip}
            User: \n                ${JSON.stringify(request.user)}
            Message：${result?.message}
            Response data: \n                ${JSON.stringify(data())} \n <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            `;
    }
}
