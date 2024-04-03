import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleDeptEntity } from "./role_dept.entity";
import { RoleDeptService } from "./role_dept.service";

@Module({
    imports: [TypeOrmModule.forFeature([RoleDeptEntity])],
    controllers: [],
    providers: [RoleDeptService],
    exports: [RoleDeptService],
})
export class RoleDeptModule {}
