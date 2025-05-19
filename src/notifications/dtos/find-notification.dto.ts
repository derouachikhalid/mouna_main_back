import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindNotificationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fromId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  toId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  machineId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maintenanceId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsEnum([0, 1])
  read_status?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  orderBy?: string = 'created_at';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC' = 'DESC';
}
