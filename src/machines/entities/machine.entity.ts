import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn()
  machine_id: number;

  @Column()
  modele: string;

  @Column()
  marque: string;

  @Column({ unique: true })
  numero_serie: string;

  @Column({ type: 'date' })
  date_achat: Date;

  @Column({ type: 'date' })
  fin_garantie: Date;

  @Column({ type: 'text', nullable: true })
  pannes_frequentes: string;

  @OneToMany(() => Maintenance, (m) => m.machine)
  maintenance: Maintenance[];
}
