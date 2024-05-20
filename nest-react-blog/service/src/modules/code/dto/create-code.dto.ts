import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCodeDto {
  @ApiProperty({ description: '用户Id' })
  userId: string;

  @ApiProperty({ description: '标题' })
  @IsNotEmpty({ message: 'title不能为空' })
  title: string;

  @ApiProperty({ description: '类型' })
  @IsNotEmpty({ message: '类型不能为空' })
  type: string;

  @ApiProperty({ description: '描述' })
  description: string;

  @ApiProperty({ description: '分享code' })
  shareCode: string;
}
