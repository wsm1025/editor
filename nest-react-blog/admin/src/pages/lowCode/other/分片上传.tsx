import { mergeFile, uploadChunk } from '@/services/auth';
import { Card } from '@arco-design/web-react';

const LowCode = () => {
  const fileChange = async () => {
    const chunk = 5 * 1024 * 1024; // 1MB
    const file = document.getElementById('file') as HTMLInputElement;
    // 文件切割
    const fileChunkList = sliceFile(file.files[0], chunk);
    // 文件上传
    const randomStr = Math.random().toString(36).substr(2);
    const task = [];
    fileChunkList.map((item, index) => {
      const formData = new FormData();
      formData.set('name', randomStr + '-' + file.files[0].name + '-' + index);
      formData.append('files', item);
      task.push(uploadChunk(formData));
    });
    await Promise.all(task);
    // 合并文件
    const data = await mergeFile({
      name: randomStr + '-' + file.files[0].name,
    });
    console.log(data);
  };

  const sliceFile = (file: File, chunkSize: number) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push(file.slice(cur, cur + chunkSize));
      cur += chunkSize;
    }
    return fileChunkList;
  };
  return (
    <Card title="大文件上传">
      <input type="file" id="file" onChange={() => fileChange()} />
    </Card>
  );
};

export default LowCode;
