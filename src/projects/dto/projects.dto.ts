import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  IsOptional,
  IsDate,
} from 'class-validator';

export class ProjectsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @IsString()
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @Min(1000)
  budget: number;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
