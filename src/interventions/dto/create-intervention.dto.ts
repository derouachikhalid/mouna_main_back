import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInterventionDto {
  @IsNotEmpty()
  maintenanceId: number;

  @IsNotEmpty()
  technicienId: number;

  @IsNotEmpty()
  start_datetime: Date;

  @IsOptional()
  end_datetime?: Date;

  @IsEnum(['En attente', 'En cours', 'Terminé'])
  statut: 'En attente' | 'En cours' | 'Terminé';

  @IsOptional()
  remarques?: string;
}
