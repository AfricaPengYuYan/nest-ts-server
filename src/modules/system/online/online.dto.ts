import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { PageDto } from "~/dto/pager.dto";

export class KickDto {
    @ApiProperty({ description: "tokenId" })
    @IsString()
    tokenId: string;
}

export class QueryOnlineDto extends PageDto { }
