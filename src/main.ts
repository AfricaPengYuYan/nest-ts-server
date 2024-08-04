import { HttpStatus, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationError } from "class-validator";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http.exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggerService } from "./shared/logger/logger.service";
import { initSwagger } from "./swagger/loadSwagger.config";

const SERVER_PORT = process.env.SERVER_PORT;

async function bootstrap() {
    // 发起请求->中间件(middleware)->守卫(guards)->全局拦截器(interceptors 控制器之前)->管道(pipes)->控制器(方法处理器)->路由拦截器->(请求之后)全局过滤器->异常过滤器

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        bufferLogs: true,
    });

    // logger
    app.useLogger(app.get(LoggerService));

    // validate
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            exceptionFactory: (errors: ValidationError[]) => {
                return new UnprocessableEntityException(
                    errors
                        .filter((item) => !!item.constraints)
                        .flatMap((item) => Object.values(item.constraints))
                        .join("; "),
                );
            },
        }),
    );

    // 初始化Swagger
    initSwagger(app);

    // 允许跨站访问
    app.enableCors();

    // execption
    app.useGlobalFilters(new HttpExceptionFilter(app.get(LoggerService)));

    // 全局响应过滤器
    app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

    await app.listen(SERVER_PORT, "0.0.0.0");
}

bootstrap();
