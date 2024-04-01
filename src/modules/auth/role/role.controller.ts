import {Controller} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {RoleService} from './role.service';

@ApiTags('角色管理')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {
    }

}
