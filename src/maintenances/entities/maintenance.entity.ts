import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';
import { User } from '../../users/entities/user.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Intervention } from 'src/interventions/entities/intervention.entity';

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

  @OneToMany(() => Notification, (n) => n.maintenance)
      notifications_created : Notification[];

  @OneToMany(() => Intervention, (i) => i.maintenance)
      interventions : Intervention[];
  
  @CreateDateColumn()
  date_creation: Date;
}
