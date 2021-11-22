/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty, 
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class requestResetDto {
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail()
  @ApiProperty({
    description: 'This is a user email',
})
  email: string;
}