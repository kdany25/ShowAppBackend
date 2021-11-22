/* eslint-disable prettier/prettier */
import {
  IsNotEmpty, 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class resetPasswordDto {
  @IsNotEmpty({
    message: 'new password is required',
  })
  @ApiProperty({
    description: 'This is a new user\'s password',
})
  newPassword: string;
 
  @IsNotEmpty({
    message: 'confirm password is required'
  })
  @ApiProperty({
    description: 'This is a confirm password',
})
  confirmPassword: string;
}