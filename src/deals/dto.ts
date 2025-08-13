import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateDealDto {
  @IsString() name!: string;
  @IsInt() @Min(0) amount!: number;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsString() currency?: string;
}

export class UpdateDealDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsInt() @Min(0) amount?: number;
  @IsOptional() @IsString() stage?: string;
}
