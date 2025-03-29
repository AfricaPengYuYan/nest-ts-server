import type { ConfigKeyPaths } from "./config";

import cluster from "node:cluster";

import path from "node:path";

import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";

import { NestFactory } from "@nestjs/core";

import { NestFastifyApplication } from "@nestjs/platform-fastify";

import { useContainer } from "class-validator";

import helmet from "helmet";

import { mw as requestIpMw } from "request-ip";
import { AppModule } from "./app.module";
import { fastifyApp } from "./common/adapters/fastify.adapter";
import { RedisIoAdapter } from "./common/adapters/socket.adapter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { isDev, isMainProcess } from "./global/env";
import { setupSwagger } from "./setup-swagger";
import { LoggerService } from "./shared/logger/logger.service";

declare const module: any;

async function bootstrap() {
    // 创建 NestJS 应用实例
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyApp,
        {
            bufferLogs: true, // 缓冲日志
            snapshot: true, // 启用快照
            // forceCloseConnections: true,
        },
    );

    const configService = app.get(ConfigService<ConfigKeyPaths>);

    const { port, globalPrefix } = configService.get("app", { infer: true });

    // 配置 class-validator 以支持依赖注入
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // 配置跨域
    app.enableCors({ origin: "*", credentials: true });
    // 设置全局路由前缀
    app.setGlobalPrefix(globalPrefix);
    // 配置静态资源目录
    app.useStaticAssets({ root: path.join(__dirname, "..", "public") });
    // 生产环境启用优雅关闭钩子
    !isDev && app.enableShutdownHooks();

    // 开发环境启用日志拦截器
    if (isDev)
        app.useGlobalInterceptors(new LoggingInterceptor());

    // 配置请求IP中间件
    app.use(requestIpMw({ attributeName: "ip" }));

    // 配置安全头
    app.use(helmet({
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        crossOriginResourcePolicy: false, // 开发环境允许跨域访问静态资源
    }));

    // 配置全局验证管道
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // 开启数据转换
            whitelist: true, // 启用白名单验证
            transformOptions: {
                enableImplicitConversion: true, // 启用隐式转换
            },
            stopAtFirstError: true, // 遇到第一个错误即停止
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            exceptionFactory: errors =>
                new UnprocessableEntityException(
                    errors.map((e) => {
                        const rule = Object.keys(e.constraints!)[0];
                        const msg = e.constraints![rule];
                        return msg;
                    })[0],
                ),
        }),
    );

    app.useWebSocketAdapter(new RedisIoAdapter(app));

    setupSwagger(app, configService);

    await app.listen(port, "0.0.0.0", async () => {
        app.useLogger(app.get(LoggerService));
        const url = await app.getUrl();
        const { pid } = process;
        const env = cluster.isPrimary;
        const prefix = env ? "P" : "W";

        if (!isMainProcess)
            return;

        const logger = new Logger("NestApplication");
        logger.log(`[${prefix + pid}] Server running on ${url}`);

        if (isDev)
            logger.log(`[${prefix + pid}] OpenAPI: ${url}/api-docs`);
    });

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
