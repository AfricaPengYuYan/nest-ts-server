import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { MenuModule } from "./modules/auth/menu/menu.module";
import { RoleModule } from "./modules/auth/role/role.module";
import { RoleDeptModule } from "./modules/auth/role_dept/role_dept.module";
import { RoleMenuModule } from "./modules/auth/role_menu/role_menu.module";
import { UserModule } from "./modules/auth/user/user.module";
import { UserRoleModule } from "./modules/auth/user_role/user_role.module";

import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerModuleOptions, WinstonLogLevel } from "./shared/logger/logger.interface";

import { ConfigurationKeyPaths, getConfiguration } from "./config/configuration";
import { LOGGER_MODULE_OPTIONS } from "./shared/logger/logger.constants";
import { LoggerModule } from "./shared/logger/logger.module";
import { TypeORMLoggerService } from "./shared/logger/typeorm-logger.service";
import { SharedModule } from "./shared/shared.module";

@Module({
    imports: [
        // 配置模块
        ConfigModule.forRoot({
            ignoreEnvFile: false,
            isGlobal: true,
            load: [getConfiguration],
            envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
        }),
        // 使用MySql
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, LoggerModule],
            useFactory: async (configService: ConfigService<ConfigurationKeyPaths>, loggerOptions: LoggerModuleOptions) => ({
                autoLoadEntities: true,
                type: configService.get<any>("database.type"),
                host: configService.get<string>("database.host"),
                port: configService.get<number>("database.port"),
                username: configService.get<string>("database.username"),
                password: configService.get<string>("database.password"),
                database: configService.get<string>("database.database"),
                synchronize: configService.get<boolean>("database.synchronize"),
                logging: configService.get("database.logging"),
                timezone: configService.get("database.timezone"), // 时区
                // 自定义日志
                logger: new TypeORMLoggerService(configService.get("database.logging"), loggerOptions),
            }),
            inject: [ConfigService, LOGGER_MODULE_OPTIONS],
        }),
        // Logger
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    level: configService.get<WinstonLogLevel>("logger.level"),
                    consoleLevel: configService.get<WinstonLogLevel>("logger.consoleLevel"),
                    timestamp: configService.get<boolean>("logger.timestamp"),
                    maxFiles: configService.get<string>("logger.maxFiles"),
                    maxFileSize: configService.get<string>("logger.maxFileSize"),
                    disableConsoleAtProd: configService.get<boolean>("logger.disableConsoleAtProd"),
                    dir: configService.get<string>("logger.dir"),
                    errorLogName: configService.get<string>("logger.errorLogName"),
                    appLogName: configService.get<string>("logger.appLogName"),
                };
            },
            inject: [ConfigService],
        }),
        // 共享模块
        SharedModule,
        // RBAC
        UserModule,
        UserRoleModule,
        RoleModule,
        RoleMenuModule,
        RoleDeptModule,
        MenuModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
