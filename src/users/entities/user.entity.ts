import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Intervention } from 'src/interventions/entities/intervention.entity';

export enum UserRole {
  ADMIN = 'Admin',
  TECHNICIEN = 'Technicien',
  HOTLINER = 'Hotliner',
  CLIENT = 'Client',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Maintenance, (maintenance) => maintenance.techniciens)
  maintenances: Maintenance[];

  @OneToMany(() => Notification, (n) => n.from)
    notifications_created : Notification[];

  @OneToMany(() => Intervention, (i) => i.technicien)
    interventions : Intervention[];

  @OneToMany(() => Notification, (n) => n.to)
    notifications_taged : Notification[];

  // Hash the password before saving
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
