import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyReply } from "fastify";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TRANSFORM_KEEP_KEY_METADATA } from "../contants/decorator.contants";
import { ResponseDto } from "../dto/response.dto";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const keep = this.reflector.get<boolean>(TRANSFORM_KEEP_KEY_METADATA, context.getHandler());
                if (keep) {
                    return data;
                } else {
                    const response = context.switchToHttp().getResponse<FastifyReply>();
                    response.header("Content-Type", "application/json; charset=utf-8");
                    return new ResponseDto(200, data);
                }
            }),
        );
    }
}
