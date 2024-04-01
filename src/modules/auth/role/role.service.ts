import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {RoleEntity} from './role.entity';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly repository: Repository<RoleEntity>,
    ) {
    }
}
