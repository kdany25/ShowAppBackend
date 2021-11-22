/* eslint-disable prettier/prettier */
import {
  IsNotEmpty, 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
export class changePasswordDto {
  @IsNotEmpty({
    message: 'current password is required',
  })
  @ApiProperty({
    description: 'This is a user\'s current password',
  })
  currentPassword: string;

  @IsNotEmpty({
    message: 'new password is required',
  })
  @ApiProperty({
    description: 'This is a user\'s new password',
  })
  newPassword: string;
 
  @IsNotEmpty({
    message: 'confirm password is required'
  })
  @ApiProperty({
    description: 'This is a user\'s confirm password',
  })
  confirmPassword: string;
}