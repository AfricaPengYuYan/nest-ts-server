import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

import { PagerDto } from '~/dto/pager.dto'

export class KickDto {
    @ApiProperty({ description: 'tokenId' })
    @IsString()
    tokenId: string
}

export class OnlineQueryDto extends PagerDto {}
