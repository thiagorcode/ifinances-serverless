import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import * as crypto from 'crypto';

const PrevPasswordSymbol = Symbol('UserPrevPassword');
const PrevEmailSymbol = Symbol('UserPrevEmail');
const PasswordPlaceholder = '***********';

@Entity({ name: 'users', database: 'gen' })
@Unique(['email', 'username'])
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '100', nullable: false })
  username: string;

  @Column({ type: 'varchar', length: '100', nullable: false })
  email: string;

  @Column({ type: 'varchar', length: '80', nullable: false })
  password: string;

  @Column({ type: 'bool' })
  isActive: boolean;

  @Column({ type: 'bool', default: false })
  isPasswordChange: boolean;

  @CreateDateColumn()
  dtCreated: Date;

  @UpdateDateColumn()
  dtUpdated: Date;

  @AfterLoad()
  loadPassword() {
    this[PrevEmailSymbol] = this.email;
    this[PrevPasswordSymbol] = this.password;
    this.password = PasswordPlaceholder;
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password === PasswordPlaceholder) {
      this.password = this[PrevPasswordSymbol];
    }

    if (this.password && this.password.length !== 64) {
      this.password = crypto
        .createHash('sha256')
        .update(`${this.username}_${this.password}`)
        .digest('hex');
    }

    if (
      this.password !== this[PrevPasswordSymbol] ||
      this.email !== this[PrevEmailSymbol]
    ) {
      this[PrevPasswordSymbol] = this.password;
      this[PrevEmailSymbol] = this.email;
    }
  }

  get unmaskedPassword() {
    return this.password === PasswordPlaceholder
      ? this[PrevPasswordSymbol]
      : this.password;
  }
}
