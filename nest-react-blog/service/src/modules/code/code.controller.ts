import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FindLimitDto } from 'src/dto/find-limit-dto';

@ApiTags('代码')
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @ApiOperation({ summary: '查询用户相关代码' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('getCodeByUserId')
  @UseInterceptors(ClassSerializerInterceptor) // 不包含密码 @Exclude()的字段
  getAllCodeByUserId(
    @Query()
    query: FindLimitDto & {
      title?: string;
      type?: string;
    },
    @Req() req,
  ) {
    return this.codeService.getAllCodeByUserId(query, req.user);
  }

  @ApiOperation({ summary: '创建代码' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('postCode')
  create(@Body() createCodeDto: CreateCodeDto, @Req() req) {
    return this.codeService.create({
      ...createCodeDto,
      userId: req.user.userId,
    });
  }

  @ApiOperation({ summary: '更新代码' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('updateCode')
  update(@Body() updateCodeDto: UpdateCodeDto, @Req() req) {
    return this.codeService.update({
      ...updateCodeDto,
      userId: req.user.userId,
    });
  }

  @ApiOperation({ summary: '删除代码' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('deleteCode')
  delete(@Body('codeId') codeId: string, @Req() req) {
    return this.codeService.deleteCode(codeId, req.user);
  }

  @ApiOperation({ summary: '获取代码片段' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('getCodeById')
  getCodeById(@Query('codeId') codeId: string, @Req() req) {
    return this.codeService.getCodeById(codeId, req.user);
  }

  @ApiOperation({ summary: '分享代码' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('shareCode')
  shareCode(@Query('codeId') codeId: string, @Req() req) {
    return this.codeService.shareCode(codeId, req.user);
  }

  @ApiOperation({ summary: '通过分享code获取代码' })
  @Get('/getCodeByShareCode/:shareId')
  getCodeByShareCode(@Param('shareId') shareId: string) {
    return this.codeService.getCodeByShareCode(shareId);
  }
}
