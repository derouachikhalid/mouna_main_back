// src/notifications/entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @ManyToOne(() => User, { nullable: false })
  from: User;

  @ManyToOne(() => User, { nullable: false })
  to: User;

  @ManyToOne(() => Maintenance, { nullable: true })
  maintenance: Maintenance;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'tinyint', default: 0 })
  read_status: number;

  @CreateDateColumn()
  created_at: Date;
}
