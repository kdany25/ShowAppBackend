import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { CreateOrganisationDto } from './create-organisation.dto';

export class UpdateOrganisationDto extends PartialType(CreateOrganisationDto) {
    @IsOptional()
    @IsString()
    @Matches(/.?[^!@#$%*&^]/, {
        message: 'Please include a letter',
      })
      @ApiProperty({
        description: 'the name  of organisation',
        default: 'Lux Entetainers updated'})
    name:string;

    @IsEmail()
    @IsOptional()
    email?:string;

    @IsString()
    @IsOptional()
    avatar?:string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description:string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address:string;
    
}
