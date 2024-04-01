import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RoleMenuEntity} from './role_menu.entity';
import {RoleMenuService} from './role_menu.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoleMenuEntity])],
    controllers: [],
    providers: [RoleMenuService],
    exports: [RoleMenuService],
})
export class RoleMenuModule {
}
