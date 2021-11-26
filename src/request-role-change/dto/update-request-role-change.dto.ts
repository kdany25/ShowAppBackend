import { PartialType } from '@nestjs/swagger';
import { CreateRequestRoleChangeDto } from './create-request-role-change.dto';

export class UpdateRequestRoleChangeDto extends PartialType(CreateRequestRoleChangeDto) {}
