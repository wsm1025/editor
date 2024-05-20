import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

export enum UserRoleEnum {
  User = 'user',
  Admin = 'admin',
}
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ name: 'user_name', length: 10, comment: '用户名' })
  userName: string;

  @Column({
    name: 'nick_name',
    length: 10,
    comment: '昵称',
  })
  nickName: string;

  @Exclude()
  @Column({ comment: '密码', length: 100 })
  password: string;

  @Column({ comment: '邮箱', nullable: true, length: 20 })
  email: string;

  @Column({ comment: '手机号', nullable: true, length: 11 })
  phone: string;

  @Column({
    comment: '头像',
    nullable: true,
    default: '/static/171327345267698499643.jpeg',
  })
  avatar: string;

  @Column('simple-enum', {
    enum: UserRoleEnum,
    comment: '角色',
    default: UserRoleEnum.User,
  })
  role: string;

  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
    comment: '更新时间',
  })
  updateTime: Date;

  @Exclude()
  @Column({
    name: 'delete_flag',
    comment: '标签状态 -1:删除 0:启用',
    type: 'int',
    default: 0,
  })
  deleteFlag: number;

  @BeforeInsert()
  async encryptPwd() {
    if (!this.password) return;
    this.password = await bcrypt.hashSync(this.password);
  }
  // 都会执行
  @BeforeInsert()
  setNickName() {
    // 设置昵称
    if (!this.nickName) {
      this.nickName = this.userName;
    }
  }
}
