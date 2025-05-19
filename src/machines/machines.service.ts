import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { FindMachineDto } from './dtos/find-machine.dto';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
  ) {}

  async findAll(filters: FindMachineDto) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'date_achat',
      orderDirection = 'DESC',
    } = filters;

    const query = this.machineRepository.createQueryBuilder('machine');

    if (filters.marque) {
      query.andWhere('machine.marque = :marque', { marque: filters.marque });
    }

    if (filters.modele) {
      query.andWhere('machine.modele = :modele', { modele: filters.modele });
    }

    if (filters.search) {
      query.andWhere(
        '(machine.modele LIKE :search OR machine.marque LIKE :search OR machine.numero_serie LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query
      .orderBy(`machine.${orderBy}`, orderDirection)
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

  findOne(id: number): Promise<Machine | null> {
    return this.machineRepository.findOne({ where: { machine_id: id } });
  }

  async create(machineData: Partial<Machine>): Promise<Machine> {
    const machine = this.machineRepository.create(machineData);
    return await this.machineRepository.save(machine);
  }

  async update(
    id: number,
    machineData: Partial<Machine>,
  ): Promise<Machine | null> {
    await this.machineRepository.update(id, machineData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.machineRepository.delete(id);
  }
}
