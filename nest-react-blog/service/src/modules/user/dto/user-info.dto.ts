import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FindLimitDto } from '../../../dto/find-limit-dto';

export class ListUserDto extends PartialType(FindLimitDto) {}

export class UserInfoDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ description: '用户昵称' })
  nickName: string;

  @ApiProperty({ description: '用户头像' })
  avatar: string;

  @ApiProperty({ description: '用户邮箱' })
  email: string;

  @ApiProperty({ description: '手机号' })
  phone: string;

  @ApiProperty({ description: '角色' })
  role: string;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @ApiProperty({ description: '用户Id' })
  userId?: string;
}
