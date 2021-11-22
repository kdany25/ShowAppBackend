import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { User } from "src/user/entities/user.entity";


export class CreateOrganisationDto {


    @IsString()
    @IsNotEmpty({message:"Organisation name can not be empty"})
    @Length(3,40,{message:"Organisation name must be between 3- 40 characters"})
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
    
    @IsNotEmpty()
    @ApiProperty({
    description: 'The title of a todo',
    default: {"firstName":"hugues",
    "lastName":"Ntwari",
    "email":"ntwari.hugues@gmail.com",
    "role":"USER",
    "password":"18700",
    "phone":"0781407229",
    "dOb":"1996/01/16",
    "gender":"MALE",
    "avatar":"https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg"
}})
    user:User;
}
