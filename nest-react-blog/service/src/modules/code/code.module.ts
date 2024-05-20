import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { Code as CodeEntity } from './entities/code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeEntity])],
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
