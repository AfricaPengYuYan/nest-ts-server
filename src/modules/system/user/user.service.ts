import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { MenuService } from '../menu/menu.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
        private readonly roleService: RoleService,
        private readonly menuService: MenuService,
        private readonly configService: ConfigService,
    ) {}
}
