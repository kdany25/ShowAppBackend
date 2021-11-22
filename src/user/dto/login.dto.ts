/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty, 
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class userLoginDto {
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail()
  @ApiProperty({
    description: 'This is a user email',
    default: 'habajeunes2@gmail.com'
})
  email: string;
 
  @IsNotEmpty({
    message: 'password is required'
  })
  @ApiProperty({
    description: 'This is a user password',
    default:'123456'
})
  password: string;
}
