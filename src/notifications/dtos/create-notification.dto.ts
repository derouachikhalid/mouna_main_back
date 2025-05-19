import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  fromId: number;

  @IsNumber()
  toId: number;

  
  @IsNumber()
  machineId?: number;

  
  @IsNumber()
  maintenanceId?: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
