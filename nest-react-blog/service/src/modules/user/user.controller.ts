import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInfoDto, ListUserDto } from './dto/user-info.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 200, type: UserInfoDto })
  @UseInterceptors(ClassSerializerInterceptor) // 不包含密码 @Exclude()的字段
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor) // 不包含密码 @Exclude()的字段
  @Post('update')
  update(@Body() updateUser: UpdateUserDto) {
    return this.userService.update(updateUser);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor) // 不包含密码 @Exclude()的字段
  @Post('delete')
  @UseGuards(RolesGuard)
  delete(@Req() req, @Body('userId') userId) {
    return this.userService.delete(req.user, userId);
  }

  @ApiOperation({ summary: '获取全部用户信息' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor) // 不包含密码 @Exclude()的字段
  @Get('getAllUser')
  async getAllUser(@Query() query: ListUserDto) {
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '获取单个用户信息' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor) // 不包含密码 @Exclude()的字段
  @Get('detail')
  async getUserInfo(@Req() req) {
    return this.userService.findOne(req.param.userId);
  }

  @ApiOperation({ summary: '获取网络上传信息' })
  @Get('getWebToken')
  async getWebToken(@Query('appKey') appKey: string) {
    return this.userService.getWebToken(appKey);
  }
}
