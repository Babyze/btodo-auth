import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn({
    name: 'auth_id',
  })
  authID: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date | null;

  @Column({ name: 'account_id' })
  accountID: number;
}
