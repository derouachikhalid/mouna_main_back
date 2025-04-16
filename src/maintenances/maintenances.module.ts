import { Module } from '@nestjs/common';
import { MaintenancesController } from './maintenances.controller';
import { MaintenancesService } from './maintenances.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Machine } from 'src/machines/entities/machine.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance, Machine, User])],
  controllers: [MaintenancesController],
  providers: [MaintenancesService],
})
export class MaintenancesModule {}
