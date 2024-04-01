import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DeptEntity} from "./dept.entity";
import {DeptService} from "./dept.service";
import {DeptController} from "./dept.controller";

@Module({
    imports: [TypeOrmModule.forFeature([DeptEntity])],
    controllers: [DeptController],
    providers: [DeptService],
})
export class DeptModule {
}
