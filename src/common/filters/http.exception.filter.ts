import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {Response} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const {status, responseParam} = this.isHttpException(exception);
        const message = this.handleRespondMessage(responseParam);

        response.status(status).send({
            code: status,
            message,
            data: null,
        });
    }

    private isHttpException(exception) {
        if (exception instanceof HttpException) {
            return {
                status: exception.getStatus(),
                responseParam: exception.getResponse(),
            };
        } else {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                responseParam: exception.toString(),
            };
        }
    }

    private handleRespondMessage(param) {
        const statusCode = param?.statusCode;
        if (statusCode) {
            // 处理管道参数验证返回的错误
            return param.message;
        } else {
            // 处理正常抛出错误
            return param;
        }
    }
}
