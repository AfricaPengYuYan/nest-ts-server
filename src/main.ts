import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { initSwagger } from "./swagger/loadSwagger.config";
import { TransformInterceptor } from "~/common/interceptors/transform.interceptor";

async function bootstrap() {
    // 发起请求->中间件(middleware)->守卫(guards)->全局拦截器(interceptors 控制器之前)->管道(pipes)->控制器(方法处理器)->路由拦截器->(请求之后)全局过滤器->异常过滤器

    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    // 初始化Swagger
    initSwagger(app, config);

    // 允许跨站访问
    app.enableCors();

    // 全局响应过滤器
    app.useGlobalInterceptors(new TransformInterceptor());

    // 端口
    const port = config.get<number>("system.port");

    await app.listen(port, () => {
        console.info(`主服务启动成功，地址：127.0.0.1:${port}`);
        console.info(`Swagger 服务启动成功，地址：127.0.0.1:${port}/api`);
    });
}

bootstrap();
