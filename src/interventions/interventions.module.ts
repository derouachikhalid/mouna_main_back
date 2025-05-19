import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Intervention } from './entities/intervention.entity';
import { InterventionsController } from './interventions.controller';
import { InterventionsService } from './interventions.service';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Intervention, Maintenance, User])],
  controllers: [InterventionsController],
  providers: [InterventionsService],
})
export class InterventionsModule {}
