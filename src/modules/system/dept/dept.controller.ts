import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('部门管理')
@Controller('dept')
export class DeptController {}
