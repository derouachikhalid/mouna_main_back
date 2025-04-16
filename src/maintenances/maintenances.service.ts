import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Machine } from '../machines/entities/machine.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectRepository(Maintenance)
    private maintenanceRepo: Repository<Maintenance>,

    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.maintenanceRepo.find();
  }

  findOne(id: number) {
    return this.maintenanceRepo.findOne({ where: { maintenance_id: id } });
  }

  async create(data: {
    machine_id: number;
    technicien_ids: number[];
    type: 'Corrective' | 'Préventive';
    description: string;
    date_prevue?: Date;
    etat: 'Planifiée' | 'En cours' | 'Terminée';
  }) {
    const machine = await this.machineRepo.findOneBy({
      machine_id: data.machine_id,
    });
    const techniciens = await this.userRepo.findByIds(data.technicien_ids);

    data['machine'] = machine;
    data['techniciens'] = techniciens;
    const maintenance = this.maintenanceRepo.create(data);

    return this.maintenanceRepo.save(maintenance);
  }

  async update(id: number, updateData: Partial<Maintenance>) {
    await this.maintenanceRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.maintenanceRepo.delete(id);
  }
}
