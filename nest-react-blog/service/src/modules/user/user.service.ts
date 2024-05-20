import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiException, ApiErrCode } from '../../core/exceptions/api.exception';
import { User } from './entities/user.entity';
import { ListUserDto } from './dto/user-info.dto';
import axios from 'axios';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(createUser: CreateUserDto) {
    const { userName } = createUser;
    // 判断用户名是否存在
    const existUser = await this.userRepository.findOne({
      where: { userName, deleteFlag: 0 },
    });
    if (existUser) {
      throw new ApiException(ApiErrCode.USER_EXIST);
    }
    const newUser = await this.userRepository.create(createUser);
    // 解构后 该对象与原始的 newUser 对象不再具有关联性
    // 手动触发 BeforeInsert
    await this.userRepository.save(newUser);
    return {
      message: '注册成功',
    };
  }
  async update(updateUser: UpdateUserDto) {
    const { userId } = updateUser;
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (!user) {
      throw new ApiException(ApiErrCode.USER_NOT_EXIST);
    }
    const updateFields = {
      ...updateUser,
    };
    // 排除的key
    const excludedProperties = [
      'userName',
      'createTime',
      'role',
      'userId',
      'password',
      'updateTime',
    ];
    for (const prop of excludedProperties) {
      delete updateFields[prop];
    }
    // 更新符合条件的记录
    await this.userRepository.update({ userId }, updateFields);
    return {
      message: '更新成功',
    };
  }
  async delete(op, userId) {
    // 查询 token信息 是否有权限
    if (op.role !== 'admin') {
      throw new ApiException(ApiErrCode.NO_PERMISSIN);
    }
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (!user) {
      throw new ApiException(ApiErrCode.USER_NOT_EXIST);
    }
    if (user.role === 'admin') {
      throw new ApiException(ApiErrCode.NO_PERMISSIN);
    }
    await this.userRepository.update({ userId }, { deleteFlag: 1 });
    return {
      message: '删除成功',
    };
  }

  async findAll(query: ListUserDto) {
    // 分页查询
    const { size = 10, page = 1 } = query;
    const search = {
      deleteFlag: 0, // 查询未删除的
    };
    const startSize = (Number(page) - 1) * Number(size) ?? 0;
    const [userList, total] = await this.userRepository.findAndCount({
      where: search, // 查询条件
      skip: startSize, // 跳过多少条
      take: size, // 获取多少条
      order: {
        createTime: 'DESC', // 排序 按照时间倒序
      },
    });
    return {
      userList,
      total,
    };
  }

  async findOne(userId: string) {
    const userInfo = await this.userRepository.findOne({
      where: { userId },
    });
    return userInfo;
  }

  async getWebToken(appKey: string) {
    const get = async () => {
      console.log(1);
      try {
        const data = await axios({
          url: 'http://taizonga.top:3333/api/public/thirdConfigurationPrivder',
          method: 'post',
          data: {
            appKey,
          },
          timeout: 2000,
        });
        return data.data.data;
      } catch (error) {
        console.log(error);
        if (!error.response) {
          return {
            code: 400,
            msg: '请求超时',
          };
        } else if (error.response.data.text == '该appKey已无使用次数') {
          return {
            code: 400,
            msg: '该appKey已无使用次数',
          };
        }
        return get();
      }
    };
    return get();
  }
}
