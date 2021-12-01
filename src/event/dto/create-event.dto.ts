import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateEventDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description:'The title of an event',type:String,default:'East african party'})
  @MinLength(5,{message:'Title must be atleast 5 characters'})
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({description:'Event thumbnails',
  default:'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
  type:String,
})
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10,{message:'Event Description must be atleast 10 characters'})
  @ApiProperty({type:String,description:'Event Descripton must be from 10 characters and above',
    default:'event is well organised provide all possible requirements '
  })
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({type:Date,description:'event date to happen',default:'2000-01-15'})
  eventStartDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({type:Date,description:'event date to happen',default:'2000-01-15'})
  eventEndDate: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsMilitaryTime({message:'Event start time must be HH:MM'})
  @ApiProperty({type:Date,description:'Event starting hour',default:'12:30'})
  startHour: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsMilitaryTime({message:'Event end time must be HH:MM'})
  @ApiProperty({type:Date,description:'Event starting hour',default:'12:30'})
  endHour: Date;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({type:Boolean ,description:'Event Publishing',default:true})
  isPublished: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({type:Boolean,description:'Event is cancel',default:false})
  isCanceled: boolean;

  @IsNotEmpty()
  @IsIn(['ENTERTAINMENT','TECHNOLOGY','RELIGION','POLITICS','SPORTS'],{
    message:'event category must be one of ENTERTAINMENT,TECHNOLOGY,RELIGION,POLITICS or SPORTS'
  })
  @ApiProperty({type:String,enum:['ENTERTAINMENT','TECHNOLOGY','RELIGION','POLITICS','SPORTS'],
  description:'event categories',
  default:'ENTERTAINMENT'
})
  eventCategory: string;

  @IsIn(['HAPPENING,ENDED,STARTED'],{message:'event status must be one of HAPPENING,ENDED,STARTED'})
  @IsOptional()
  @ApiProperty({type:String,enum:['HAPPENING','ENDED','STARTED'],default:'STARTED'})
  status:string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({type:Number,description:'event vvip available seats',default:'12'})
  vvipAvailabelSeats: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({type:Number,description:'event vvip price',default:'130000'})
  vvipPrice: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({type:Number,description:'event vip available seats',default:'30'})
  vipAvailabelSeats: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({type:Number,description:'event vvip price',default:'100000'})
  vipPrice: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({type:Number,description:'event regular available seats',default:'130'})
  regularAvailabelSeats: number;
  
  @IsOptional()
  @IsNumber()
  @ApiProperty({type:Number,description:'event regural price',default:'5000'})
  regularPrice: number;

}
export class QueryParamDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
export class CancelEventDto{
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({type:Boolean,default:true,description:`cancel event by providing it's Id`})
  isCanceled:boolean;
}

