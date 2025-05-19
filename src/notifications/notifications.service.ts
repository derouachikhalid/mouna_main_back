import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { FindNotificationDto } from './dtos/find-notification.dto';
import { User } from 'src/users/entities/user.entity';
import { Machine } from 'src/machines/entities/machine.entity';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Maintenance)
    private maintenanceRepo: Repository<Maintenance>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    let data = createNotificationDto
    const from_user = await this.userRepo.findOneBy({ user_id : createNotificationDto.fromId})
    const to_user = await this.userRepo.findOneBy({ user_id : createNotificationDto.toId}) 
    const maint = await this.maintenanceRepo.findOneBy({ maintenance_id : createNotificationDto.maintenanceId}) 
    data['from'] = from_user
    data['to'] = to_user
    data['maintenance'] = maint
    const notification = this.notificationRepo.create(data);
    return await this.notificationRepo.save(notification);
  }

  async findAll(filters: FindNotificationDto) {
    const { page = 1, limit = 10, orderBy = 'created_at', orderDirection = 'DESC' } = filters;

    const query = this.notificationRepo.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.from', 'from')
      .leftJoinAndSelect('notification.to', 'to')
      .leftJoinAndSelect('notification.machine', 'machine')
      .leftJoinAndSelect('notification.maintenance', 'maintenance');

    if (filters.fromId) {
      query.andWhere('from.user_id = :fromId', { fromId: filters.fromId });
    }
    if (filters.toId) {
      query.andWhere('to.user_id = :toId', { toId: filters.toId });
    }
    if (filters.machineId) {
      query.andWhere('machine.machine_id = :machineId', { machineId: filters.machineId });
    }
    if (filters.maintenanceId) {
      query.andWhere('maintenance.maintenance_id = :maintenanceId', { maintenanceId: filters.maintenanceId });
    }
    if (filters.read_status !== undefined) {
      query.andWhere('notification.read_status = :read_status', { read_status: filters.read_status });
    }
    if (filters.search) {
      query.andWhere('notification.description LIKE :search', { search: `%${filters.search}%` });
    }

    query
      .orderBy(`notification.${orderBy}`, orderDirection)
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

  async findOne(id: number) {
    return await this.notificationRepo.findOne({
      where: { notification_id: id },
      relations: ['from', 'to', 'machine', 'maintenance'],
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationRepo.findOneBy({ notification_id: id });
    if (!notification) {
      throw new Error('Notification not found');
    }
    Object.assign(notification, updateNotificationDto);
    return this.notificationRepo.save(notification);
  }

  async remove(id: number) {
    return this.notificationRepo.delete(id);
  }
}
