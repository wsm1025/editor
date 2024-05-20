import { Injectable } from '@nestjs/common';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Code } from './entities/code.entity';
import { FindLimitDto } from 'src/dto/find-limit-dto';
import { UserInfoDto } from '../user/dto/user-info.dto';
import { ApiErrCode, ApiException } from 'src/core/exceptions/api.exception';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
  ) {}
  async getAllCodeByUserId(
    query: FindLimitDto & {
      title?: string;
      type?: string;
    },
    user: UserInfoDto,
  ) {
    // 分页查询
    const { size = 10, page = 1 } = query;
    const search = {
      userId: user.userId,
      deleteFlag: 0, // 查询未删除的
      ...(query.type && { type: query.type }),
      title: Like(`%${query.title}%`),
    };
    const startSize = (Number(page) - 1) * Number(size) ?? 0;
    let [codeList, total] = await this.codeRepository.findAndCount({
      where: search, // 查询条件
      skip: startSize, // 跳过多少条
      take: size, // 获取多少条
      order: {
        createTime: 'DESC', // 排序 按照时间倒序
      },
      select: [
        'createTime',
        'updateTime',
        'codeId',
        'type',
        'title',
        'description',
        'shareId',
      ],
    });
    codeList = codeList.map((e) => ({ ...e, userName: user.userName }));

    return {
      codeList,
      total,
    };
  }

  async create(createCodeDto: CreateCodeDto) {
    const newCode = await this.codeRepository.create(createCodeDto);
    // 解构后 该对象与原始的 newUser 对象不再具有关联性
    // 手动触发 BeforeInsert
    const { codeId } = await this.codeRepository.save(newCode);
    return {
      message: '创建成功',
      codeId,
    };
  }

  async update(updateCodeDto: UpdateCodeDto) {
    const { codeId, userId } = updateCodeDto;
    const record = await this.codeRepository.findOne({
      where: { codeId, userId },
    });
    if (!record) {
      throw new ApiException(ApiErrCode.NO_CODE_OR_NO_PERMISSIN);
    }
    const updateFields = {
      ...updateCodeDto,
    };
    // 排除的key
    const excludedProperties = [
      'createTime',
      'updateTime',
      'deleteFlag',
      'userName',
      'codeId',
      'userId',
    ];
    for (const prop of excludedProperties) {
      delete updateFields[prop];
    }
    // 更新符合条件的记录
    await this.codeRepository.update({ codeId }, updateFields);
    return {
      message: '更新成功',
    };
  }

  async deleteCode(codeId: string, user: UserInfoDto) {
    const record = await this.codeRepository.findOne({
      where: { codeId, userId: user.userId },
    });
    if (!record) {
      throw new ApiException(ApiErrCode.NO_CODE_OR_NO_PERMISSIN);
    }
    await this.codeRepository.update({ codeId }, { deleteFlag: 1 });

    return {
      message: '删除成功',
    };
  }

  async getCodeById(codeId, UserInfo: UserInfoDto) {
    const codeInfo = await this.codeRepository.findOne({
      where: { codeId, userId: UserInfo.userId },
    });
    if (!codeInfo) {
      throw new ApiException(ApiErrCode.NO_CODE_OR_NO_PERMISSIN);
    }
    return {
      message: '获取成功',
      codeInfo,
    };
  }

  async shareCode(codeId: string, user: UserInfoDto) {
    const record = await this.codeRepository.findOne({
      where: { codeId, userId: user.userId },
    });
    if (!record) {
      throw new ApiException(ApiErrCode.NO_CODE_OR_NO_PERMISSIN);
    }
    if (record.shareId) {
      await this.codeRepository.update({ codeId }, { shareId: null });

      return {
        message: '取消分享成功',
      };
    } else {
      const shareId = uuidv4();
      await this.codeRepository.update({ codeId }, { shareId });
      return {
        message: '分享成功',
        shareId,
      };
    }
  }

  async getCodeByShareCode(shareId: string) {
    const codeInfo = await this.codeRepository.findOne({
      where: { shareId },
      select: ['shareId', 'type', 'code', 'userId'],
    });
    if (!codeInfo) {
      throw new ApiException(ApiErrCode.NO_CODE_OR_NO_PERMISSIN);
    }
    return {
      message: '获取成功',
      codeInfo,
    };
  }
}
