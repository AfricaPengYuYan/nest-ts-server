import { Exclude } from 'class-transformer';

import { ApiHideProperty } from '@nestjs/swagger';

export class OperatorDto {
    @ApiHideProperty()
    @Exclude()
    createBy: number;

    @ApiHideProperty()
    @Exclude()
    updateBy: number;
}
