import path from "node:path";

import { HttpStatus, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { fastifyApp } from "./common/adapters/fastify.adapter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { isDev } from "./global/env";
import { setupSwagger } from "./setup-swagger";

import type { ConfigKeyPaths } from "./config";

async function bootstrap() {
    // 发起请求->中间件(middleware)->守卫(guards)->全局拦截器(interceptors 控制器之前)->管道(pipes)->控制器(方法处理器)->路由拦截器->(请求之后)全局过滤器->异常过滤器

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp, {
        bufferLogs: true,
        snapshot: true,
    });

    const configService = app.get(ConfigService<ConfigKeyPaths>);

    const { port, globalPrefix } = configService.get("app", { infer: true });

    // class-validator 的 DTO 类中注入 nest 容器的依赖 (用于自定义验证器)
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // 允许跨站访问
    app.enableCors({ origin: "*", credentials: true });

    app.setGlobalPrefix(globalPrefix);
    app.useStaticAssets({ root: path.join(__dirname, "..", "public") });

    !isDev && app.enableShutdownHooks();

    // logger
    if (isDev) app.useGlobalInterceptors(new LoggingInterceptor());

    // validate
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            transformOptions: { enableImplicitConversion: true },
            // forbidNonWhitelisted: true, // 禁止 无装饰器验证的数据通过
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            stopAtFirstError: true,
            exceptionFactory: (errors) =>
                new UnprocessableEntityException(
                    errors.map((e) => {
                        const rule = Object.keys(e.constraints!)[0];
                        const msg = e.constraints![rule];
                        return msg;
                    })[0],
                ),
        }),
    );

    // 初始化Swagger
    setupSwagger(app, configService);

    await app.listen(port, "0.0.0.0");
}

bootstrap();
