import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Machine } from '../machines/entities/machine.entity';
import { User } from '../users/entities/user.entity';
import { FindMaintenanceDto } from './dtos/find-maintenance.dto';

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

  async findAll(filters: FindMaintenanceDto) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'date_creation',
      orderDirection = 'DESC',
    } = filters;

    const query = this.maintenanceRepo
      .createQueryBuilder('maintenance')
      .leftJoinAndSelect('maintenance.techniciens', 'technicien')
      .leftJoinAndSelect('maintenance.machine', 'machine');

    if (filters.type) {
      query.andWhere('maintenance.type = :type', { type: filters.type });
    }

    if (filters.etat) {
      query.andWhere('maintenance.etat = :etat', { etat: filters.etat });
    }

    if (filters.technicienId) {
      query.andWhere('technicien.user_id = :technicienId', {
        technicienId: filters.technicienId,
      });
    }

    if (filters.search) {
      query.andWhere('maintenance.description LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    query
      .orderBy(`maintenance.${orderBy}`, orderDirection)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
