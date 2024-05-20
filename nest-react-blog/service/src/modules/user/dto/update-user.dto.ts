import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { BeforeUpdate } from 'typeorm';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // 额外的属性
  userId: string;
}
