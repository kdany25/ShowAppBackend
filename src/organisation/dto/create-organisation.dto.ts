import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { User } from "src/user/entities/user.entity";


export class CreateOrganisationDto {


    @IsString()
    @IsNotEmpty({message:"Organisation name can not be empty"})
    @Length(3,40,{message:"Organisation name must be between 3- 40 characters"})
    @Matches(/.?[^!@#$%*&^]/, {
        message: 'Please include a letter',
      })
    @ApiProperty({
    description: 'the name  of organisation',
    default: 'Lux Entetainers'})
    name:string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({
    description: 'this is the email of the organisation',
    default: 'emailexample@email.com'})
    email?:string;

    @IsString()
    @IsOptional()
    @ApiProperty({
    description: 'The link to your avatar',
    default: ''})
    avatar?:string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
    description: 'The description of organisation',
    default: 'This is an event publisher company'})
    description:string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
    description: 'The address of an organisation',
    default: 'Kigali'})
    address:string;
    
}
