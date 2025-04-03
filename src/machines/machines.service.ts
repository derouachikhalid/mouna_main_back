import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
  ) {}

  findAll(): Promise<Machine[]> {
    return this.machineRepository.find();
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
