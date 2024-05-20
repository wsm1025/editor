import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('code')
export class Code {
  @PrimaryGeneratedColumn('uuid')
  codeId: string;

  @Column({ name: 'title', comment: '标题', length: 20, default: '我的代码' })
  title: string;

  @Column({ name: 'code', comment: '代码', type: 'text', nullable: true })
  code: string;

  @Column({ name: 'type', comment: '代码类型' })
  type: string;

  @Column({
    name: 'description',
    comment: '代码描述',
    default: 'des',
    length: 100,
  })
  description: string;

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

  @Column({ name: 'userId', comment: '代码创建人' })
  userId: string;

  @Column({
    name: 'shareId',
    comment: '代码分享链接',
    nullable: true,
  })
  shareId: string;
}
