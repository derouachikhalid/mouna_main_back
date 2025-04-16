import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';

export enum UserRole {
  ADMIN = 'Admin',
  TECHNICIEN = 'Technicien',
  HOTLINER = 'Hotliner',
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

  // Hash the password before saving
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
