import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import multer = require('multer');

@ApiTags('文件相关接口')
@Controller('file')
export class FileController {
  @ApiOperation({ summary: '文件上传' })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, join(process.cwd(), 'public'));
        },
        filename: function (req, file, cb) {
          const unique = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
          const imgPath = `${unique}.${file.mimetype.split('/')[1]}`;
          cb(null, imgPath);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter(req, file, cb) {
        // if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        //   throw new ApiException(ApiErrCode.ARTICLE_EXIST);
        // }
        cb(null, true);
      },
    }),
  )
  async coverImport(@UploadedFile() file) {
    return {
      path: `/static/${file.filename}`,
    };
  }

  @Post('upload-chunk')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      dest: 'chunkUpload',
    }),
  )
  uploadChunk(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { name: string },
  ) {
    const fileName = body.name.match(/(.+)\-\d+$/)[1];
    const chunkDir = join(process.cwd(), 'chunkUpload', fileName);
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    fs.rmSync(files[0].path);
  }

  @Get('merge')
  merge(@Query('name') name: string) {
    const chunkDir = join(process.cwd(), 'chunkUpload', name);
    const files = fs.readdirSync(chunkDir);
    files.sort((a, b) => {
      return parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]);
    });
    let count = 0,
      startPos = 0;
    files.map((file) => {
      const filePath = join(chunkDir + '/', file);
      const stream = fs.createReadStream(filePath);
      stream
        .pipe(
          fs.createWriteStream(join(process.cwd() + '/public', name), {
            start: startPos,
          }),
        )
        .on('finish', () => {
          count++;
          if (count === files.length) {
            fs.rm(chunkDir, { recursive: true }, () => {
              console.log('删除成功');
            });
          }
        });
      startPos += fs.statSync(filePath).size;
    });
    return '/static/' + name;
  }
}
