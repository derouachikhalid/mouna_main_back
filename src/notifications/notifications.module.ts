import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Maintenance])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
