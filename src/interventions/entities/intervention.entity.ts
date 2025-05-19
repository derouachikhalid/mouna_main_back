import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn, UpdateDateColumn
  } from 'typeorm';
  import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
  import { User } from 'src/users/entities/user.entity';
  
  @Entity()
  export class Intervention {
    @PrimaryGeneratedColumn()
    intervention_id: number;
  
    @ManyToOne(() => Maintenance, (maintenance) => maintenance.interventions, { eager: true })
    maintenance: Maintenance;
  
    @ManyToOne(() => User, (user) => user.interventions, { eager: true })
    technicien: User;
  
    @Column({ type: 'timestamp' })
    start_datetime: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    end_datetime: Date;
  
    @Column({ type: 'enum', enum: ['En attente', 'En cours', 'Terminé'], default: 'En attente' })
    statut: 'En attente' | 'En cours' | 'Terminé';
  
    @Column({ type: 'text', nullable: true })
    remarques: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  