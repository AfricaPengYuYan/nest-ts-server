import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuController } from "./menu.controller";
import { MenuEntity } from "./menu.entity";
import { MenuService } from "./menu.service";

@Module({
    imports: [TypeOrmModule.forFeature([MenuEntity])],
    controllers: [MenuController],
    providers: [MenuService],
    exports: [MenuService],
})
export class MenuModule {}
