import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from "src/user/entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequestRoleChangeDto {

  /* @IsNotEmpty()
  @ApiProperty({description:'This is the ID of the user that requested role change'})
  userId:string; */

}
