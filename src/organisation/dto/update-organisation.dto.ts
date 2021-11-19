import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateOrganisationDto } from './create-organisation.dto';

export class UpdateOrganisationDto extends PartialType(CreateOrganisationDto) {
    @IsOptional()
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
