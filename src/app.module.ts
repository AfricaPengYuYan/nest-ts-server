import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, LoggerOptions } from "typeorm";

import config, { ConfigKeyPaths, IDatabaseConfig } from "./config";
import { env } from "./global/env";
import { AuthModule } from "./modules/auth/auth.module";
import { MenuModule } from "./modules/auth/menu/menu.module";
import { RoleModule } from "./modules/auth/role/role.module";
import { RoleDeptModule } from "./modules/auth/role_dept/role_dept.module";
import { RoleMenuModule } from "./modules/auth/role_menu/role_menu.module";
import { UserModule } from "./modules/auth/user/user.module";
import { UserRoleModule } from "./modules/auth/user_role/user_role.module";
import { TypeORMLogger } from "./shared/database/typeorm-logger";
import { SharedModule } from "./shared/shared.module";

@Module({
    imports: [
        // 配置模块
        ConfigModule.forRoot({
            ignoreEnvFile: false,
            isGlobal: true,
            load: [...Object.values(config)],
            envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
        }),
        // 使用MySql
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
                let loggerOptions: LoggerOptions = env("DB_LOGGING") as "all";

                try {
                    // 解析成 js 数组 ['error']
                    loggerOptions = JSON.parse(loggerOptions);
                } catch {
                    // ignore
                }

                return {
                    ...configService.get<IDatabaseConfig>("database"),
                    autoLoadEntities: true,
                    logging: loggerOptions,
                    logger: new TypeORMLogger(loggerOptions),
                };
            },
            // dataSource receives the configured DataSourceOptions
            // and returns a Promise<DataSource>.
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
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
    controllers: [],
    providers: [],
})
export class AppModule {}
