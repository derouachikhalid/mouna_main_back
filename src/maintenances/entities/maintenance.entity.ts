import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';
import { User } from '../../users/entities/user.entity';

@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn()
  maintenance_id: number;

  @ManyToOne(() => Machine, (machine) => machine.maintenance, { eager: true })
  machine: Machine;

  @Column({ type: 'enum', enum: ['Corrective', 'Préventive'] })
  type: 'Corrective' | 'Préventive';

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', nullable: true })
  date_prevue?: Date;

  @Column({
    type: 'enum',
    enum: ['Planifiée', 'En cours', 'Terminée'],
    default: 'Planifiée',
  })
  etat: 'Planifiée' | 'En cours' | 'Terminée';

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: 'maintenance_technicians', // join table
    joinColumn: {
      name: 'maintenance_id',
      referencedColumnName: 'maintenance_id',
    },
    inverseJoinColumn: {
      name: 'technicien_id',
      referencedColumnName: 'user_id',
    },
  })
  techniciens: User[];

  @CreateDateColumn()
  date_creation: Date;
}
