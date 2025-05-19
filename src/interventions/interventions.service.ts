import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Intervention } from './entities/intervention.entity';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { FindInterventionDto } from './dto/find-intervention.dto';

@Injectable()
export class InterventionsService {
  constructor(
    @InjectRepository(Intervention)
    private repo: Repository<Intervention>,
  ) {}

  async create(dto: CreateInterventionDto) {
    const intervention = this.repo.create({
      start_datetime: dto.start_datetime,
      end_datetime: dto.end_datetime,
      statut: dto.statut,
      remarques: dto.remarques,
      maintenance: { maintenance_id: dto.maintenanceId },
      technicien: { user_id: dto.technicienId },
    });
    return await this.repo.save(intervention);
  }

  async findAll(query: FindInterventionDto) {
    const { page = 1, limit = 10, statut, maintenanceId, technicienId } = query;

    const qb = this.repo.createQueryBuilder('intervention')
      .leftJoinAndSelect('intervention.maintenance', 'maintenance')
      .leftJoinAndSelect('intervention.technicien', 'technicien')
      .orderBy('intervention.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (statut) qb.andWhere('intervention.statut = :statut', { statut });
    if (maintenanceId) qb.andWhere('maintenance.maintenance_id = :maintenanceId', { maintenanceId });
    if (technicienId) qb.andWhere('technicien.user_id = :technicienId', { technicienId });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    return this.repo.findOne({
      where: { intervention_id: id },
      relations: ['maintenance', 'technicien'],
    });
  }

  async update(id: number, dto: UpdateInterventionDto) {
    const intervention = await this.repo.findOneBy({ intervention_id: id });
    if (intervention) {
        Object.assign(intervention, dto);
        return await this.repo.save(intervention);
    }
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
