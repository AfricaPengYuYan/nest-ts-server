import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuEntity } from './menu.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuEntity)
        private readonly repository: Repository<MenuEntity>,
    ) {}
}
